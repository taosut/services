import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FinalExam } from '../../models/final_exam/final_exam.entity';
import { Repository, DeleteResult } from 'typeorm';
import { IFinalExam } from '../../models/final_exam/final_exam.interface';
import { CourseUser } from '../../models/courseuser/courseuser.entity';
import { Course } from '../../models/course/course.entity';
/**
 * Service dealing with final_exam based operations.
 *
 * @class
 */
@Injectable()
export class FinalExamService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {Repository<FinalExam>} finalExamRepository
   */
  constructor(
    @InjectRepository(FinalExam)
    private readonly finalExamRepository: Repository<FinalExam>,
  ) {}
  /**
   * Find all final_exam
   *
   * @function
   */
  async findAll(filters: any = {}): Promise<FinalExam[]> {
    let query = await this.finalExamRepository.createQueryBuilder('final_exams');
    if (filters.learner_id) {
      if (filters.where.track_id) {
        query = await query.leftJoinAndSelect('final_exams.track', 'tracks', 'final_exams.track_id = tracks.id');
      }
      if (filters.where.track_id && !filters.where.course_id) {
        // query = await query.leftJoinAndSelect('tracks.courses', 'courses', 'tracks.id = courses.track_id');
        // query = await query.leftJoinAndSelect('courses.course_users', 'course_users', 'course_users.course_id = courses.id');
        query = await query.andWhere('tracks.id IN ' +
                  query.subQuery().select('courses.track_id')
                  .from(Course, 'courses')
                  .where('courses.id IN ' +
                    query.subQuery().select('course_users.course_id')
                    .from(CourseUser, 'course_users')
                    .where('course_users.user_id = :learnerId', { learnerId: filters.learner_id }).getQuery(),
                  )
                  .getQuery(),
                );
        // query = await query.andWhere('courses.id IN ' +
        //           query.subQuery().select('course_users.course_id')
        //           .from(CourseUser, 'course_users')
        //           .where('course_users.user_id = :learnerId', { learnerId: filters.learner_id }).getQuery(),
        //         );
      }
      if (filters.where.course_id) {
        query = await query.leftJoinAndSelect('final_exams.course', 'courses', 'final_exams.course_id = courses.id');
        query = await query.andWhere('courses.id IN ' +
                  query.subQuery().select('course_users.course_id')
                  .from(CourseUser, 'course_users')
                  .where('course_users.user_id = :learnerId', { learnerId: filters.learner_id }).getQuery(),
                );
      }
      if (filters.where.playlist_id) {
        query = await query.leftJoinAndSelect('final_exams.playlist', 'playlists', 'final_exams.playlist_id = playlists.id');
      }
    }
    if (filters.keyword) {
      query = await query.where('final_exams.title ILIKE :keyword OR final_exams.description ILIKE :keyword ',
              { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('final_exams.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('final_exams.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('final_exams.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
        }
      }
    }
    if (filters.like) {
      for (const prop in filters.like) {
        if (prop) {
          query = await query.andWhere('final_exams.' + prop + ' LIKE :dLike ', { dLike: filters.like[prop] + '%' });
        }
      }
    }
    if (filters.orderBy) {
      for (const orderBy of filters.orderBy) {
        if (!orderBy.column.includes('.')) {
          orderBy.column = 'final_exams.' + orderBy.column;
        }
        query = await query.addOrderBy(orderBy.column, orderBy.order);
      }
    }
    return query.getMany();
  }
  /**
   * Find all final_exam with pagination
   *
   * @function
   */
  async findAllWithPagination(filters: any = {}): Promise<FinalExam[]> {
    let page = 1;
    let perPage = 5;
    if (filters.page) {
      page = filters.page;
    }
    if (filters.per_page) {
      perPage = filters.per_page;
    }
    let query = await this.finalExamRepository
                  .createQueryBuilder('final_exams');

    if (filters.keyword) {
      query = await query.where('final_exams.title ILIKE :keyword OR final_exams.description ILIKE :keyword ',
              { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('final_exams.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('final_exams.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('final_exams.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
        }
      }
    }
    if (filters.like) {
      for (const prop in filters.like) {
        if (prop) {
          query = await query.andWhere('final_exams.' + prop + ' LIKE :dLike ', { dLike: filters.like[prop] + '%' });
        }
      }
    }
    if (filters.orderBy) {
      for (const orderBy of filters.orderBy) {
        if (!orderBy.column.includes('.')) {
          orderBy.column = 'final_exams.' + orderBy.column;
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
   * Find a final_exam
   *
   * @function
   */
  async findOne(where: object = {}): Promise<FinalExam> {
    where = {
      ...where,
      deleted_at: null,
    };
    return await this.finalExamRepository.findOne({where, relations: ['track', 'course', 'playlist']});
  }
  /**
   * Find a final_exam
   *
   * @function
   */
  findOneWithTrash(where: object = {}): Promise<FinalExam> {
    return this.finalExamRepository.findOne({where, relations: ['track', 'course', 'playlist']});
  }

  /**
   * Create a final_exam
   *
   * @function
   */
  create(finalExam: FinalExam): Promise<FinalExam> {
    return this.finalExamRepository
      .findOne({ id: finalExam.id })
      // .exec()
      .then(async dbFinalExam => {
        // We check if a finalExam already exists.
        // If it does don't create a new one.
        if (dbFinalExam) {
          return Promise.reject({message: 'FinalExam is already exist ' + dbFinalExam.deleted_at ? '' : 'in the trash'});
        }
        return Promise.resolve(
          await this.finalExamRepository.save(finalExam),
        );
      })
      .catch(error => Promise.reject(error));
  }
  /**
   * Seed all finalExams.
   *
   * @function
   */
  createMultiple(finalExams: FinalExam[]): Array<Promise<FinalExam>> {
    return finalExams.map(async (finalExam: IFinalExam) => {
      return await this.finalExamRepository
        .findOne({ id: finalExam.id })
        // .exec()
        .then(async dbFinalExam => {
          // We check if a finalExam already exists.
          // If it does don't create a new one.
          if (dbFinalExam) {
            return Promise.reject({message: 'FinalExam is already exist ' + dbFinalExam.deleted_at ? '' : 'in the trash'});
          }
          return Promise.resolve(
            await this.finalExamRepository.save(finalExam),
          );
        })
        .catch(error => Promise.reject(error));
    });
  }

  /**
   * Update a final_exam
   *
   * @function
   */
  async update(id: string, newData: any): Promise<FinalExam> {
    const oldData = await this.finalExamRepository.findOne({id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'FinalExam is not exist'});
    }

    const updated: FinalExam = Object.assign(oldData, newData);
    return this.finalExamRepository.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

  /**
   * Delete a final_exam
   *
   * @function
   */
  async delete(id: string): Promise<FinalExam | DeleteResult> {
    const oldData = await this.finalExamRepository.findOne({ id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'FinalExam is not exist'});
    }
    if (oldData.deleted_at) {
      return Promise.reject({statusCode: 404, message: 'FinalExam is already in the trash'});
    }

    const updated: FinalExam = Object.assign(oldData, {deleted_at: new Date(Date.now())});
    return this.finalExamRepository.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

  /**
   * Delete a final_exam
   *
   * @function
   */
  async restore(id: string): Promise<FinalExam | DeleteResult> {
    const oldData = await this.finalExamRepository.findOne({ id });
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'FinalExam is not exist'});
    }
    if (!oldData.deleted_at) {
      return Promise.reject({statusCode: 404, message: 'FinalExam cannot be found in the trash'});
    }

    const updated: FinalExam = Object.assign(oldData, {deleted_at: null});
    return this.finalExamRepository.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

  /**
   * Delete a final_exam
   *
   * @function
   */
  async forceDelete(id: string): Promise<FinalExam | DeleteResult> {
    const oldData = await this.finalExamRepository.findOne({ id });
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'FinalExam is not exist'});
    }
    if (!oldData.deleted_at) {
      return Promise.reject({statusCode: 404, message: 'FinalExam cannot be found in the trash'});
    }

    return this.finalExamRepository.delete({id})
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }
}
