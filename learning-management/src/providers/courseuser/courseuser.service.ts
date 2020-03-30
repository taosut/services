import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseUser } from '../../models/courseuser/courseuser.entity';
import { Repository, DeleteResult, Not, IsNull, Like } from 'typeorm';
import { ICourseUser } from '../../models/courseuser/courseuser.interface';
/**
 * Service dealing with courseuser based operations.
 *
 * @class
 */
@Injectable()
export class CourseUserService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {Repository<CourseUser>} courseuserRepository
   */
  constructor(
    @InjectRepository(CourseUser)
    private readonly courseuserRepository: Repository<CourseUser>,
  ) {}
  /**
   * Find all courseuser
   *
   * @function
   */
  async findAll(filters: any = {}): Promise<CourseUser[]> {
    let query = await this.courseuserRepository.createQueryBuilder('course_users');
    if (filters.keyword) {
      query = await query.where('course_users.title ILIKE :keyword OR course_users.description ILIKE :keyword ',
              { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('course_users.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('course_users.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('course_users.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
        }
      }
    }
    return query.getMany();
  }
  /**
   * Find all courseuser with pagination
   *
   * @function
   */
  async findAllWithPagination(filters: any = {}): Promise<CourseUser[]> {
    let page = 1;
    let perPage = 5;
    if (filters.page) { page = filters.page; }
    if (filters.per_page) { perPage = filters.per_page; }

    let query = await this.courseuserRepository
                  .createQueryBuilder('course_users');

    if (filters.keyword) {
      query = await query.where('course_users.title ILIKE :keyword OR course_users.description ILIKE :keyword ',
              { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('course_users.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('course_users.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('course_users.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
        }
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
   * Find a courseuser
   *
   * @function
   */
  findOne(where: object = {}): Promise<CourseUser> {
    where = {
      ...where,
    };
    return this.courseuserRepository.findOne({where});
  }
  /**
   * Find a courseuser
   *
   * @function
   */
  findOneWithTrash(where: object = {}): Promise<CourseUser> {
    return this.courseuserRepository.findOne({where});
  }

  /**
   * Create a courseuser
   *
   * @function
   */
  create(courseuser: CourseUser): Promise<CourseUser> {
    return this.courseuserRepository
      .findOne({ user_id: courseuser.user_id, course_id: courseuser.course_id })
      // .exec()
      .then(async dbCourseUser => {
        // We check if a courseuser already exists.
        // If it does don't create a new one.
        if (dbCourseUser) {
          return Promise.reject({message: 'CourseUser is already exist'});
        }
        return Promise.resolve(
          await this.courseuserRepository.save(courseuser),
        );
      })
      .catch(error => Promise.reject(error));
  }
  /**
   * Seed all courseusers.
   *
   * @function
   */
  createMultiple(courseusers: CourseUser[]): Array<Promise<CourseUser>> {
    return courseusers.map(async (courseuser: ICourseUser) => {
      console.log('courseuser', courseuser);
      return await this.courseuserRepository
        .findOne({ user_id: courseuser.user_id, course_id: courseuser.course_id })
        // .exec()
        .then(async dbCourseUser => {
          // We check if a courseuser already exists.
          // If it does don't create a new one.
          if (dbCourseUser) {
            return Promise.reject({message: 'User is already exist in course'});
          }
          return Promise.resolve(
            await this.courseuserRepository.save(courseuser),
          );
        })
        .catch(error => Promise.reject(error));
    });
  }

  /**
   * Update a courseuser
   *
   * @function
   */
  async update(id: string, newData: any): Promise<CourseUser> {
    const oldData = await this.courseuserRepository.findOne({ id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'CourseUser is not exist'});
    }

    const updated: CourseUser = Object.assign(oldData, newData);
    return this.courseuserRepository.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

  /**
   * Delete a courseuser
   *
   * @function
   */
  async forceDelete(where): Promise<CourseUser | DeleteResult> {
    const oldData = await this.courseuserRepository.findOne(where);
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'CourseUser is not exist'});
    }

    return this.courseuserRepository.delete(where)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }
}
