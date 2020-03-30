import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Track } from '../../models/track/track.entity';
import { Course } from '../../models/course/course.entity';
import { Repository, DeleteResult, Between, getConnection } from 'typeorm';
import { ITrack } from '../../models/track/track.interface';
import { CourseUser } from '../../models/courseuser/courseuser.entity';
/**
 * Service dealing with track based operations.
 *
 * @class
 */
@Injectable()
export class TrackService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {Repository<Track>} trackRepository
   * @param {Repository<Course>} courseRepository
   */
  constructor(
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}
  /**
   * Find all track
   *
   * @function
   */
  async findAll(filters: any = {}): Promise<Track[]> {
    const valuesTrackIdByLearner: string[] = [];
    // if learner_Id is set
    if (filters.learner_id) {
      // get course id can access by learner
      const queryCourseUser = await getConnection().createQueryBuilder()
                        .select('courses.track_id')
                        .from(Course, 'courses')
                        .leftJoinAndSelect('courses.course_users', 'course_users')
                        .where('course_users.user_id = :learnerId', {learnerId: filters.learner_id})
                        .getMany();
      for (const value of queryCourseUser) {
        valuesTrackIdByLearner.push(value.track_id);
      }
      if (valuesTrackIdByLearner.length === 0) {
        valuesTrackIdByLearner.push(null);
      }
    }
    let query = await this.trackRepository.createQueryBuilder('tracks');
    if (filters.learner_id) {
      query = await query.andWhere('tracks.id IN (:...valuesTrackIdByLearner)', {valuesTrackIdByLearner});
    }
    if (filters.keyword) {
      query = await query.where('tracks.title ILIKE :keyword OR tracks.description ILIKE :keyword ', { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('tracks.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('tracks.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('tracks.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
        }
      }
    }
    if (filters.like) {
      for (const prop in filters.like) {
        if (prop) {
          query = await query.andWhere('tracks.' + prop + ' LIKE :dLike ', { dLike: filters.like[prop] + '%' });
        }
      }
    }
    if (filters.orderBy) {
      for (const orderBy of filters.orderBy) {
        if (!orderBy.column.includes('.')) {
          orderBy.column = 'tracks.' + orderBy.column;
        }
        query = await query.addOrderBy(orderBy.column, orderBy.order);
      }
    }
    return query.getMany();
  }
  /**
   * Find all track
   *
   * @function
   */
  async getCount(filters: any = {}): Promise<number> {
    let query = await this.trackRepository.createQueryBuilder('tracks');
    if (filters.keyword) {
      query = await query.where('tracks.title ILIKE :keyword OR tracks.description ILIKE :keyword ', { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('tracks.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('tracks.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('tracks.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
        }
      }
    }
    if (filters.like) {
      for (const prop in filters.like) {
        if (prop) {
          query = await query.andWhere('tracks.' + prop + ' LIKE :dLike ', { dLike: filters.like[prop] + '%' });
        }
      }
    }
    if (filters.orderBy) {
      for (const orderBy of filters.orderBy) {
        if (!orderBy.column.includes('.')) {
          orderBy.column = 'tracks.' + orderBy.column;
        }
        query = await query.addOrderBy(orderBy.column, orderBy.order);
      }
    }
    return query.getCount();
  }
  /**
   * Find all track with pagination
   *
   * @function
   */
  async findAllWithPagination(filters: any = {}): Promise<Track[]> {
    console.info('trackService > findAllWithPagination');
    const valuesTrackIdByLearner: string[] = [];
    // if learner_Id is set
    if (filters.learner_id) {
      // get course id can access by learner
      const queryCourseUser = await getConnection().createQueryBuilder()
                        .select('courses.track_id')
                        .from(Course, 'courses')
                        .leftJoinAndSelect('courses.course_users', 'course_users')
                        .where('course_users.user_id = :learnerId', {learnerId: filters.learner_id})
                        .getMany();
      for (const value of queryCourseUser) {
        valuesTrackIdByLearner.push(value.track_id);
      }
      if (valuesTrackIdByLearner.length === 0) {
        valuesTrackIdByLearner.push(null);
      }
    }
    let page = 1;
    let perPage = 5;
    if (filters.page) {
      page = filters.page;
    }
    if (filters.per_page) {
      perPage = filters.per_page;
    }
    let query = await this.trackRepository
                  .createQueryBuilder('tracks');
    if (filters.learner_id) {
      query = await query.andWhere('tracks.id IN (:...valuesTrackIdByLearner)', {valuesTrackIdByLearner});
    }
    if (filters.keyword) {
      query = await query.where('tracks.title ILIKE :keyword OR tracks.description ILIKE :keyword ', { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('tracks.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('tracks.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('tracks.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
        }
      }
    }
    if (filters.like) {
      for (const prop in filters.like) {
        if (prop) {
          query = await query.andWhere('tracks.' + prop + ' LIKE :dLike ', { dLike: filters.like[prop] + '%' });
        }
      }
    }
    if (filters.orderBy) {
      for (const orderBy of filters.orderBy) {
        if (orderBy.column.indexOf('.') === -1) {
          orderBy.column = 'tracks.' + orderBy.column;
        }
        query = await query.addOrderBy(orderBy.column, orderBy.order);
      }
    }

    query = query.limit(perPage)
          .offset((page - 1) * perPage);
    const totalPage = await query.getCount();

    return query.getMany()
          .then(async response => {
            if (!response) {
              return Promise.resolve(null);
            }

            const lastPage = await Math.ceil(totalPage / perPage);
            const result = {
              total: totalPage,
              per_page: Number(perPage),
              current_page: Number(page),
              last_page: totalPage > 0 ? lastPage : 1,
              data: response,
            };
            return Promise.resolve(result);
          }).catch(error => Promise.reject(error));
  }
  /**
   * Find a track
   *
   * @function
   */
  findOne(where: object = {}): Promise<Track> {
    where = {
      ...where,
      deleted_at: null,
    };
    return this.trackRepository.findOne({where, relations: ['courses']});
  }
  /**
   * Find a track
   *
   * @function
   */
  findOneWithTrash(where: object = {}): Promise<Track> {
    return this.trackRepository.findOne({where, relations: ['courses']});
  }

  /**
   * Create a track
   *
   * @function
   */
  create(track: Track): Promise<Track> {
    return this.trackRepository
      .findOne({ id: track.id })
      // .exec()
      .then(async dbTrack => {
        // We check if a track already exists.
        // If it does don't create a new one.
        if (dbTrack) {
          return Promise.reject({message: 'Track is already exist ' + dbTrack.deleted_at ? '' : 'in the trash'});
        }
        return Promise.resolve(
          await this.trackRepository.save(track),
        );
      })
      .catch(error => Promise.reject(error));
  }
  /**
   * Seed all tracks.
   *
   * @function
   */
  createMultiple(tracks: Track[]): Array<Promise<Track>> {
    return tracks.map(async (track: ITrack) => {
      return await this.trackRepository
        .findOne({ id: track.id })
        // .exec()
        .then(async dbTrack => {
          // We check if a track already exists.
          // If it does don't create a new one.
          if (dbTrack) {
            return Promise.reject({message: 'Track is already exist ' + dbTrack.deleted_at ? '' : 'in the trash'});
          }
          return Promise.resolve(
            await this.trackRepository.save(track),
          );
        })
        .catch(error => Promise.reject(error));
    });
  }

  /**
   * Update a track
   *
   * @function
   */
  async update(id: string, newData: any): Promise<Track> {
    const oldData = await this.trackRepository.findOne({ id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'Track is not exist'});
    }

    const updated: Track = Object.assign(oldData, newData);
    return this.trackRepository.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

  /**
   * Delete a track
   *
   * @function
   */
  async delete(id: string): Promise<Track | DeleteResult> {
    const oldData = await this.trackRepository.findOne({ id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'Track is not exist'});
    }
    if (oldData.deleted_at) {
      return Promise.reject({statusCode: 404, message: 'Track is already in the trash'});
    }

    const updated: Track = Object.assign(oldData, {deleted_at: new Date(Date.now())});
    return this.trackRepository.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

  /**
   * Delete a track
   *
   * @function
   */
  async restore(id: string): Promise<Track | DeleteResult> {
    const oldData = await this.trackRepository.findOne({ id });
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'Track is not exist'});
    }
    if (!oldData.deleted_at) {
      return Promise.reject({statusCode: 404, message: 'Track cannot be found in the trash'});
    }

    const updated: Track = Object.assign(oldData, {deleted_at: null});
    return this.trackRepository.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

  /**
   * Delete a track
   *
   * @function
   */
  async forceDelete(id: string): Promise<Track | DeleteResult> {
    const oldData = await this.trackRepository.findOne({ id });
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'Track is not exist'});
    }
    if (!oldData.deleted_at) {
      return Promise.reject({statusCode: 404, message: 'Track cannot be found in the trash'});
    }

    return this.trackRepository.delete({id})
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

  /**
   * Add track on course
   *
   * @function
   */
  async addTrackOnCourse(idTrack: string, idCourse: string): Promise<any> {
    const oldData = await this.courseRepository.findOne({id : idCourse});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'Course is not exist'});
    }

    const newData = {
      ...oldData,
      track_id : idTrack,
    };
    const updated: Course = Object.assign(oldData, newData);

    return this.courseRepository.save(updated)
    .then(res => Promise.resolve(res))
    .catch(error => Promise.reject(error));
  }

  /**
   * Remove track on course
   *
   * @function
   */
  async removeTrackOnCourse(idTrack: string, idCourse: string): Promise<any> {
    const oldData = await this.courseRepository.findOne({id : idCourse});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'Course is not exist'});
    }

    const newData = {
      ...oldData,
      track_id : null,
    };
    const updated: Course = Object.assign(oldData, newData);

    return this.courseRepository.save(updated)
    .then(res => Promise.resolve(res))
    .catch(error => Promise.reject(error));
  }

  /**
   * Change Order Track
   *
   * @function
   */
  async changeOrder(data: any): Promise<any> {
    const oldData = await this.trackRepository.findOne({id : data.id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'Track is not exist'});
    }
    const newData = {
      ...oldData,
      sort_order : data.sort_order,
    };
    const updated: Track = Object.assign(oldData, newData);

    return this.trackRepository.save(updated)
    .then(res => Promise.resolve(res))
    .catch(error => Promise.reject(error));
  }

  /**
   * Find Track between Order
   *
   * @function
   */
  async findBetween(from: any, to: any): Promise<any> {
    return this.trackRepository.find({
      where: {
        sort_order: Between(from, to),
        deleted_at : null,
      },
      order: {
        sort_order: 'ASC',
      },
    })
    .then(res => Promise.resolve(res))
    .catch(error => Promise.reject(error));
  }

  /**
   * Replace Track between Order
   *
   * @function
   */
  async replaceOrderBetween(operation: string, from: number, to: number): Promise<any> {
    console.info(from + ' == ' + to);
    const varbebas = '"sort_order" ' + (operation === 'minus' ? '-1' : '+1');
    return this.trackRepository.createQueryBuilder().update(Track).set({
      sort_order : () => varbebas,
    }).where('sort_order BETWEEN :from AND :to', {
      from, to,
    }).execute();
  }

  /**
   * Find Track between Order
   *
   * @function
   */
  async getOneOrder(order: string): Promise<any> {
    return this.trackRepository.find({
      select : ['id', 'sort_order'],
      order : {
        sort_order : order === 'DESC' ? 'DESC' : 'ASC',
      },
      take : 1,
    })
    .then(res => Promise.resolve(res))
    .catch(error => Promise.reject(error));
  }

  async getListByIds(ids: string[]) {
    if (ids.length === 0) {
      ids.push(null);
    }
    let query = await this.trackRepository.createQueryBuilder('tracks');
    query = await query.leftJoinAndSelect('tracks.courses', 'courses', 'courses.track_id=tracks.id')
            .leftJoinAndSelect('courses.playlists', 'playlists', 'playlists.course_id=courses.id')
            .where('tracks.id IN (:...valueIds)', {valueIds: ids});
    return await query.getMany();
  }
}
