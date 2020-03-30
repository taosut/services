import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateManyDto, CrudRequest } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import _ from 'lodash';
import { Repository } from 'typeorm';
import { ClassService } from '../class/class.service';
import { UnitService } from '../unit/unit.service';
import { Track } from './track.entity';

@Injectable()
export class TrackService extends TypeOrmCrudService<Track> {
  constructor(
    @InjectRepository(Track)
    protected readonly repository: Repository<Track>,

    @Inject(forwardRef(() => UnitService))
    protected readonly unitService: UnitService,

    @Inject(forwardRef(() => ClassService))
    protected readonly classService: ClassService
  ) {
    super(repository);
  }

  async createMany(
    req: CrudRequest,
    dto: CreateManyDto<Track>
  ): Promise<Track[]> {
    const tracks = await super.createMany(req, dto);

    for (let track of tracks) {
      const classEntity = await this.classService.findOne(track.class_id);

      if (classEntity.index_tracks) {
        classEntity.index_tracks.push(track.id);
      } else {
        classEntity.index_tracks = [track.id];
      }

      classEntity.published = false;

      await this.classService.update(classEntity);

      track = await this.repository.findOne(track.id);
    }

    return tracks;
  }

  async createOne(req: CrudRequest, dto: Track): Promise<Track> {
    const trackEntity = await super.createOne(req, dto);

    const classEntity = await this.classService.findOne(trackEntity.class_id);

    if (classEntity.index_tracks) {
      classEntity.index_tracks.push(trackEntity.id);
    } else {
      classEntity.index_tracks = [trackEntity.id];
    }

    classEntity.published = false;

    await this.classService.update(classEntity);

    const response = await this.repository.findOne(trackEntity.id);

    return response;
  }

  async update(dto: Track): Promise<Track> {
    dto.class = await this.classService.findOne(dto.class_id);

    const entity = await this.repository.create(dto);

    const response = await this.repository.save(entity);
    return response;
  }

  async findById(id: string): Promise<Track> {
    const track = await this.repository.findOne({ where: { id } });

    if (track && track.index_units) {
      const unitSorter = await this.sortUnits(track);

      return unitSorter;
    }

    return track;
  }

  async getOne(req: CrudRequest): Promise<Track> {
    const track = await super.getOne(req);

    if (track.index_units) {
      const unitSorter = await this.sortUnits(track);

      return unitSorter;
    }

    return track;
  }

  async sortUnits(trackDto: Track): Promise<Track> {
    const sorterUnits = [];

    let needUpdate = false;
    for (const id of trackDto.index_units) {
      const unit = await this.unitService.findById(id);

      if (unit) {
        await sorterUnits.push(unit);
      } else {
        _.remove(trackDto.index_units, itemId => {
          return itemId === id;
        });

        needUpdate = true;
      }
    }

    if (needUpdate) {
      delete trackDto.units;
      delete trackDto.class;
      await this.repository.save(trackDto);
    }

    trackDto.units = sorterUnits;

    return trackDto;
  }
}
