import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateManyDto, CrudRequest } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import _ from 'lodash';
import { Repository } from 'typeorm';
import { ContentInvokeService } from '../../services/invokes/content.service';
import { ExamInvokeService } from '../../services/invokes/exam.service';
import { TrackService } from '../track/track.service';
import { AudioTrackService } from './audioTrack/audioTrack.service';
import { EbookService } from './ebook/ebook.service';
import { EUnitType } from './types/unit.const';
import { UnitDto } from './types/unit.dto';
import { Unit } from './unit.entity';

@Injectable()
export class UnitService extends TypeOrmCrudService<Unit> {
  constructor(
    @InjectRepository(Unit)
    protected readonly repository: Repository<Unit>,

    @Inject(forwardRef(() => TrackService))
    protected readonly trackService: TrackService,

    @Inject(forwardRef(() => EbookService))
    protected readonly ebookService: EbookService,

    @Inject(forwardRef(() => AudioTrackService))
    protected readonly audioTrackService: AudioTrackService,

    protected readonly examInvokeService: ExamInvokeService,
    protected readonly contentInvokeService: ContentInvokeService
  ) {
    super(repository);
  }

  async findById(id: string): Promise<UnitDto> {
    const unit = (await this.repository.findOne({
      where: { id },
      relations: ['ebooks', 'audio_tracks'],
    })) as UnitDto;

    if (unit) {
      return await this.resolveUnit(unit);
    }

    return unit;
  }

  async createMany(
    req: CrudRequest,
    dto: CreateManyDto<Unit>
  ): Promise<Unit[]> {
    const units = await super.createMany(req, dto);

    for (let unit of units) {
      this.validateUnitType(unit);

      const trackEntity = await this.trackService.findOne(unit.track_id);

      if (trackEntity.index_units) {
        trackEntity.index_units.push(unit.id);
      } else {
        trackEntity.index_units = [unit.id];
      }

      await this.trackService.update(trackEntity);

      unit = await this.repository.findOne(unit.id);
    }

    return units;
  }

  async createOne(req: CrudRequest, dto: Unit): Promise<Unit> {
    dto = this.validateUnitType(dto);

    const unit = await super.createOne(req, dto);

    const trackEntity = await this.trackService.findOne(unit.track_id);

    if (trackEntity.index_units) {
      trackEntity.index_units.push(unit.id);
    } else {
      trackEntity.index_units = [unit.id];
    }

    await this.trackService.update(trackEntity);
    unit.track = trackEntity;

    return await this.resolveUnit(unit as UnitDto);
  }

  async updateOne(req: CrudRequest, dto: Unit): Promise<Unit> {
    dto = this.validateUnitType(dto);

    const response = await super.updateOne(req, dto);
    return response;
  }

  validateUnitType(dto: Unit): Unit {
    const unitTypes = _.values(EUnitType);

    if (!_.includes(unitTypes, dto.type)) {
      throw new HttpException(
        {
          message: `Incorrect Unit Type, available type : [ ${unitTypes.toString()} ]`,
          status: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST
      );
    }

    if (dto.type === EUnitType.exam) {
      delete dto.content_id;
      delete dto.audio_tracks;
      delete dto.ebooks;
    }

    if (dto.type === EUnitType.video) {
      delete dto.audio_tracks;
      delete dto.ebooks;

      if (!dto.content_id) {
        throw new HttpException(
          'content_id is required',
          HttpStatus.BAD_REQUEST
        );
      }
    }

    if (dto.type === EUnitType.audio) {
      delete dto.ebooks;

      if (!dto.content_id) {
        throw new HttpException(
          'content_id is required',
          HttpStatus.BAD_REQUEST
        );
      }
    }

    if (dto.type === EUnitType.ebook) {
      delete dto.audio_tracks;
    }

    return dto;
  }

  async resolveUnit(dto: UnitDto): Promise<UnitDto> {
    if (dto.ebooks) {
      dto.ebooks = _.orderBy(dto.ebooks, ['page_number'], ['asc']);
    }

    if (dto.type === EUnitType.video || dto.type === EUnitType.audio) {
      const content = await this.contentInvokeService.findOne(dto.content_id);
      dto.content = content;
    }

    if (dto.type === EUnitType.exam) {
      const exam = await this.examInvokeService.findByMeta(dto.id);

      if (exam && exam.length) {
        dto.exam = exam[0];
        dto.exam_id = exam[0].id;
      }
    }

    return dto;
  }
}
