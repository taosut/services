import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { IsUUID } from 'class-validator';
import _ from 'lodash';
import { Repository } from 'typeorm';
import { ContentInvokeService } from '../../services/invokes/content.service';
import { MembershipsInvokeService } from '../../services/invokes/membership.service';
import { TrackService } from '../track/track.service';
import { EUnitType } from '../unit/types/unit.const';
import { UnitDto } from '../unit/types/unit.dto';
import { Unit } from '../unit/unit.entity';
import { Class } from './class.entity';
import { FindByMetaDto, MyClassDto } from './types/class.dto';
import { ClassInfoDto } from './types/classInfo.dto';
import { ClassResponse } from './types/classResponse';
import { QueryDto } from './types/query.dto';
import { resolveQueryFilter } from './utils/resolveQueryFilter';
@Injectable()
export class ClassService extends TypeOrmCrudService<Class> {
  constructor(
    @InjectRepository(Class)
    protected readonly repository: Repository<Class>,

    @Inject(forwardRef(() => TrackService))
    protected readonly trackService: TrackService,

    protected membershipsInvokeService: MembershipsInvokeService,
    protected readonly contentInvokeService: ContentInvokeService
  ) {
    super(repository);
  }

  async update(dto: Class): Promise<Class> {
    const entity = await this.repository.create(dto);
    const response = await this.repository.save(entity);

    return response;
  }

  async findClass(query: FindByMetaDto): Promise<Class[]> {
    const queries: string[] = [];
    let queryString: string = '';

    if (query.categories) {
      const queryValues = query.categories.split(',');
      let tmpQuery = '';
      for (const [index, item] of queryValues.entries()) {
        const value = item.trim();
        const separate = Number(index) < queryValues.length - 1 ? 'OR' : '';

        const tmpBaseQuery = `JSON_CONTAINS(class.meta->"$.categories[*].category", '["${value}"]')`;
        tmpQuery += `${tmpBaseQuery} ${separate} `;
      }

      queries.push(tmpQuery);
    }

    if (query.sub_categories) {
      const queryValues = query.sub_categories.split(',');
      let tmpQuery = '';
      for (const [index, item] of queryValues.entries()) {
        const value = item.trim();
        const separate = Number(index) < queryValues.length - 1 ? 'OR' : '';

        const tmpBaseQuery = `JSON_CONTAINS(class.meta->"$.categories[*].sub_categories[*]", '["${value}"]')`;
        tmpQuery += `${tmpBaseQuery} ${separate} `;
      }
      queries.push(tmpQuery);
    }

    if (query.series) {
      const queryValues = query.series.split(',');
      let tmpQuery = '';
      for (const [index, item] of queryValues.entries()) {
        const value = item.trim();
        const separate = Number(index) < queryValues.length - 1 ? 'OR' : '';

        const tmpBaseQuery = `JSON_CONTAINS(class.meta->"$.series[*]", '["${value}"]')`;
        tmpQuery += `${tmpBaseQuery} ${separate} `;
      }
      queries.push(tmpQuery);
    }

    if (query.filter) {
      const tmpQuery = resolveQueryFilter(query.filter);

      queries.push(tmpQuery);
    }

    queryString = queries.join(' AND ');

    const response = await this.repo
      .createQueryBuilder('class')
      .where(queryString)
      .getMany();

    return response;
  }

  async getOne(req: CrudRequest): Promise<ClassResponse> {
    const id = _.find(req.parsed.paramsFilter, obj => {
      return obj.field === 'id';
    }).value;

    const classEntity = IsUUID(id)
      ? ((await super.getOne(req)) as ClassResponse)
      : ((await this.repository.findOneOrFail({
          where: { slug: id },
        })) as ClassResponse);

    if (classEntity.preview_file_id) {
      classEntity.preview_file = await this.contentInvokeService.findOne(
        classEntity.preview_file_id
      );
    }
    if (classEntity.featured_file_id) {
      classEntity.featured_file = await this.contentInvokeService.findOne(
        classEntity.featured_file_id
      );
    }

    const response = await this.resolveTracks(classEntity);

    return response;
  }
  async classBySlug(slug: string): Promise<ClassResponse> {
    const classEntity = (await this.repository.findOneOrFail({
      where: { slug },
    })) as ClassResponse;

    const classResolvedContent = await this.resolveContent(classEntity);

    const response = await this.resolveTracks(classResolvedContent);

    if (response.tracks) {
      for (const [i] of response.tracks.entries()) {
        for (const [j] of response.tracks[i].units.entries()) {
          const unit = response.tracks[i].units[j] as UnitDto;
          delete unit.content_id;
          delete unit.content;
          delete unit.content_ids;
          delete unit.ebooks;
          delete unit.audio_tracks;

          response.tracks[i].units[j] = unit;
        }
      }
    }

    return response;
  }

  async createOne(req: CrudRequest, dto: Class): Promise<Class> {
    dto.published = false;
    const response = await super.createOne(req, dto);

    return response;
  }

  async updateOne(req: CrudRequest, dto: Class): Promise<Class> {
    const response = await super.updateOne(req, dto);

    const classEntity = await this.repository.findOne({
      where: { id: response.id },
      relations: ['tracks', 'tracks.units', 'tracks.units.ebooks'],
    });

    if (classEntity && classEntity.published) {
      return await this.validateTracks(classEntity);
    }

    return response;
  }

  async replaceOne(req: CrudRequest, dto: Class): Promise<Class> {
    const response = await super.replaceOne(req, dto);

    return response;
  }

  async delete(id: string): Promise<void> {
    const classEntity = await this.repository.findOneOrFail({
      where: { id },
      relations: ['tracks'],
    });

    this.membershipsInvokeService.deleteAllByClass(classEntity.id);

    await this.repository.delete(id);
  }

  async sortTracks(classDto: Class): Promise<Class> {
    const sorterTracks = [];

    let needUpdate = false;
    for (const id of classDto.index_tracks) {
      const track = await this.trackService.findById(id);

      if (track) {
        await sorterTracks.push(track);
      } else {
        _.remove(classDto.index_tracks, itemId => {
          return itemId === id;
        });

        needUpdate = true;
      }
    }

    if (needUpdate) {
      delete classDto.tracks;

      await this.repository.save(classDto);
    }

    classDto.tracks = sorterTracks;
    return classDto;
  }

  async resolveMyClasses(
    myClasses: MyClassDto[],
    query: QueryDto
  ): Promise<MyClassDto[]> {
    for (const [index] of myClasses.entries()) {
      myClasses[index].class = await this.repository.findOne(
        myClasses[index].class_id
      );

      if (myClasses[index].class) {
        myClasses[index].class = await this.resolveContent(
          myClasses[index].class
        );

        myClasses[index].class = await this.resolveTracks(
          myClasses[index].class
        );
      }
    }

    if (query && query.sort) {
      const fields = query.sort.split('&');
      const orders = [];
      const iterates = [];

      for (const [index] of fields.entries()) {
        const field = fields[index].split(',');
        if (field && field[1]) {
          orders.push(field[1]);
        }
        if (field && field[0]) {
          iterates.push(`${field[0]}`);
        }
      }

      myClasses = _.orderBy(myClasses, iterates, orders);
    }

    return myClasses;
  }

  async resolveContent(classEntity: ClassResponse): Promise<ClassResponse> {
    if (classEntity.preview_file_id) {
      classEntity.preview_file = await this.contentInvokeService.findOne(
        classEntity.preview_file_id
      );
    }
    if (classEntity.featured_file_id) {
      classEntity.featured_file = await this.contentInvokeService.findOne(
        classEntity.featured_file_id
      );
    }

    return classEntity;
  }

  async resolveTracks(classDto: Class): Promise<Class> {
    if (classDto.index_tracks) {
      const classSorter = await this.sortTracks(classDto);

      return classSorter;
    }

    for (const [index, track] of classDto.tracks.entries()) {
      classDto.tracks[index] = await this.trackService.findById(track.id);
    }

    return classDto;
  }

  async resolveClassInfo(id: string): Promise<ClassInfoDto> {
    const classEntity = await this.repository.findOneOrFail(id, {
      relations: ['tracks'],
    });

    const classResolved = await this.resolveTracks(classEntity);

    const units: UnitDto[] = [];
    for (const track of classResolved.tracks) {
      for (const unit of track.units) {
        units.push(unit as UnitDto);
      }
    }

    const info: ClassInfoDto = {
      track: classResolved.tracks.length,
      video: 0,
      audio: 0,
      ebook: 0,
      exam: 0,
    };

    info.video = _.filter(units, unit => {
      return unit.type === EUnitType.video;
    }).length;
    info.audio = _.filter(units, unit => {
      return unit.type === EUnitType.audio;
    }).length;
    info.ebook = _.filter(units, unit => {
      return unit.type === EUnitType.ebook;
    }).length;
    info.exam = _.filter(units, unit => {
      return unit.type === EUnitType.exam;
    }).length;

    return info;
  }

  async validateTracks(classDto: Class): Promise<Class> {
    for (const track of classDto.tracks) {
      if (track.units.length) {
        await this.validateUnits(classDto, track.units);
      } else {
        classDto.published = false;
        await this.repository.save(classDto);
        throw new HttpException(
          `Cannot publish this class, track with id ${track.id} doesn't have unit`,
          HttpStatus.NOT_ACCEPTABLE
        );
      }
    }

    return classDto;
  }

  async validateUnits(classDto: Class, units: Unit[]): Promise<void> {
    for (const unit of units) {
      if (unit.type === EUnitType.ebook && !unit.ebooks.length) {
        classDto.published = false;
        await this.repository.save(classDto);
        throw new HttpException(
          `Cannot publish this class, unit with id ${unit.id} doesn't have ebooks member`,
          HttpStatus.NOT_ACCEPTABLE
        );
      }
    }
  }
}
