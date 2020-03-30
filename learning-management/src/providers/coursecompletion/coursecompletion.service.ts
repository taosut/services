import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseCompletion } from '../../models/coursecompletion/coursecompletion.entity';
import { Repository, DeleteResult, Not, IsNull } from 'typeorm';
import { ICourseCompletion } from '../../models/coursecompletion/coursecompletion.interface';
/**
 * Service dealing with coursecompletion based operations.
 *
 * @class
 */
@Injectable()
export class CourseCompletionService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {Repository<CourseCompletion>} coursecompletionRepository
   */
  constructor(
    @InjectRepository(CourseCompletion)
    private readonly coursecompletionRepository: Repository<CourseCompletion>,
  ) {}
  /**
   * Find all coursecompletion
   *
   * @function
   */
  async findAll(filters: any = {}): Promise<CourseCompletion[]> {
    let query = await this.coursecompletionRepository.createQueryBuilder('course_completions');
    if (filters.keyword) {
      query = await query.where('course_completions.title ILIKE :keyword OR course_completions.description ILIKE :keyword ',
                                { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('course_completions.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('course_completions.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('course_completions.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
        }
      }
    }
    return query.getMany();
  }
  /**
   * Find all coursecompletion with pagination
   *
   * @function
   */
  async findAllWithPagination(filters: any = {}): Promise<CourseCompletion[]> {
    let page = 1;
    let perPage = 5;
    if (filters.page) {
      page = filters.page;
    }
    if (filters.per_page) {
      perPage = filters.per_page;
    }
    let query = await this.coursecompletionRepository
                  .createQueryBuilder('course_completions');

    if (filters.keyword) {
      query = await query.where('course_completions.title ILIKE :keyword OR course_completions.description ILIKE :keyword ',
                                { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('course_completions.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('course_completions.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('course_completions.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
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
   * Find a coursecompletion
   *
   * @function
   */
  async findOne(where: object = {}): Promise<CourseCompletion> {
    return await this.coursecompletionRepository.findOne({where});
  }
  /**
   * Find a coursecompletion
   *
   * @function
   */
  findOneWithTrash(where: object = {}): Promise<CourseCompletion> {
    return this.coursecompletionRepository.findOne({where});
  }

  /**
   * Create a coursecompletion
   *
   * @function
   */
  create(coursecompletion: CourseCompletion): Promise<CourseCompletion> {
    return this.coursecompletionRepository
      .findOne({ id: coursecompletion.id })
      // .exec()
      .then(async dbCourseCompletion => {
        // We check if a coursecompletion already exists.
        // If it does don't create a new one.
        if (dbCourseCompletion) {
          return Promise.reject({message: 'CourseCompletion is already exist.'});
        }
        return Promise.resolve(
          await this.coursecompletionRepository.save(coursecompletion),
        );
      })
      .catch(error => Promise.reject(error));
  }
  /**
   * Seed all coursecompletions.
   *
   * @function
   */
  createMultiple(coursecompletions: CourseCompletion[]): Array<Promise<CourseCompletion>> {
    return coursecompletions.map(async (coursecompletion: ICourseCompletion) => {
      return await this.coursecompletionRepository
        .findOne({ id: coursecompletion.id })
        // .exec()
        .then(async dbCourseCompletion => {
          // We check if a coursecompletion already exists.
          // If it does don't create a new one.
          if (dbCourseCompletion) {
            return Promise.reject({message: 'CourseCompletion is already exist.'});
          }
          return Promise.resolve(
            await this.coursecompletionRepository.save(coursecompletion),
          );
        })
        .catch(error => Promise.reject(error));
    });
  }

  /**
   * Update a coursecompletion
   *
   * @function
   */
  async update(id: string, newData: any): Promise<CourseCompletion> {
    const oldData = await this.coursecompletionRepository.findOne({id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'CourseCompletion is not exist'});
    }
    const updated: CourseCompletion = Object.assign(oldData, newData);
    return this.coursecompletionRepository.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }
  /**
   * Delete a coursecompletion
   *
   * @function
   */
  async forceDelete(id: string): Promise<CourseCompletion | DeleteResult> {
    const oldData = await this.coursecompletionRepository.findOne({id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'CourseCompletion is not exist'});
    }
    return this.coursecompletionRepository.delete({id})
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }
}
