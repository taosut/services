import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from '../../models/course/course.entity';
import { Repository, DeleteResult, Between, QueryBuilder, getConnection } from 'typeorm';
import { ICourse } from '../../models/course/course.interface';
import { CourseUser } from '../../models/courseuser/courseuser.entity';
import { Playlist } from '../../models/playlist/playlist.entity';
/**
 * Service dealing with course based operations.
 *
 * @class
 */
@Injectable()
export class CourseService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {Repository<Course>} courseRepository
   */
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}
  /**
   * Find all course
   *
   * @function
   */
  async findAll(filters: any = {}): Promise<Course[]> {
    console.info('courseService > findAll');
    const valuesCourseIdByLearner: string[] = [];
    // if learner_Id is set
    if (filters.learner_id) {
      let queryCourse = await getConnection().createQueryBuilder()
                        .select('course_users.course_id')
                        .from(CourseUser, 'course_users')
                        .andWhere('course_users.user_id = :learnerId', {learnerId: filters.learner_id});
      if (filters.hasOwnProperty('learner_has_joined')) {
        queryCourse = await queryCourse.andWhere('course_users.has_joined = ' + (filters.learner_has_joined ? 'TRUE' : 'FALSE'));
      }
      const result = await queryCourse.getMany();
      for (const value of result) {
        valuesCourseIdByLearner.push(value.course_id);
      }
      if (valuesCourseIdByLearner.length === 0) {
        valuesCourseIdByLearner.push(null);
      }
    }
    let query = await this.courseRepository.createQueryBuilder('courses');
    if (filters.learner_id) {
      query = await query.andWhere('courses.id IN (:...valuesCourseIdByLearner)', {valuesCourseIdByLearner});
    }
    if (filters.keyword) {
      query = await query.where('courses.title ILIKE :keyword OR courses.description ILIKE :keyword ', { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('courses.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('courses.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('courses.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
        }
      }
    }
    if (filters.like) {
      for (const prop in filters.like) {
        if (prop) {
          query = await query.andWhere('courses.' + prop + ' LIKE :dLike ', { dLike: filters.like[prop] + '%' });
        }
      }
    }
    if (filters.orderBy) {
      for (const orderBy of filters.orderBy) {
        if (!orderBy.column.includes('.')) {
          orderBy.column = 'courses.' + orderBy.column;
        }
        query = await query.addOrderBy(orderBy.column, orderBy.order);
      }
    }
    return query.getMany();
  }
  /**
   * Find all course with pagination
   *
   * @function
   */
  async findAllWithPagination(filters: any = {}): Promise<Course[]> {
    console.log('courseService > findAllWithPagination');
    const valuesCourseIdByLearner: string[] = [];
    // if learner_Id is set
    if (filters.learner_id) {
      let queryCourse = await getConnection().createQueryBuilder()
                        .select('course_users.course_id')
                        .from(CourseUser, 'course_users')
                        .andWhere('course_users.user_id = :learnerId', {learnerId: filters.learner_id});
      if (filters.hasOwnProperty('learner_has_joined')) {
        queryCourse = await queryCourse.andWhere('course_users.has_joined = ' + (filters.learner_has_joined ? 'TRUE' : 'FALSE'));
      }
      const result = await queryCourse.getMany();
      for (const value of result) {
        valuesCourseIdByLearner.push(value.course_id);
      }
      if (valuesCourseIdByLearner.length === 0) {
        valuesCourseIdByLearner.push(null);
      }
    }
    let page = 1;
    let perPage = 5;
    if (filters.page) { page = filters.page; }
    if (filters.per_page) { perPage = filters.per_page; }

    let query = await this.courseRepository
                  .createQueryBuilder('courses');
    if (filters.learner_id) {
      query = await query.andWhere('courses.id IN (:...valuesCourseIdByLearner)', {valuesCourseIdByLearner});
    }
    if (filters.keyword) {
      query = await query.where('courses.title ILIKE :keyword OR courses.description ILIKE :keyword ', { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('courses.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('courses.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('courses.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
        }
      }
    }
    if (filters.like) {
      for (const prop in filters.like) {
        if (prop) {
          query = await query.andWhere('courses.' + prop + ' LIKE :dLike ', { dLike: filters.like[prop] + '%' });
        }
      }
    }
    if (filters.orderBy) {
      for (const orderBy of filters.orderBy) {
        if (!orderBy.column.includes('.')) {
          orderBy.column = 'courses.' + orderBy.column;
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
   * Find all course
   *
   * @function
   */
  async findAllCourseWithLectureWhereParentWithContent(where: any = {}): Promise<Course[]> {
    let query = await this.courseRepository.createQueryBuilder('courses');
    query = await query.leftJoinAndSelect('courses.playlists', 'playlists', 'courses.id = playlists.course_id')
            .leftJoinAndSelect('playlists.lessons', 'lessons', 'playlists.id = lessons.playlist_id')
            .leftJoinAndSelect('lessons.content', 'contents', 'lessons.id = contents.lesson_id')
            .where('courses.track_id = :track_id', { track_id: where.track_id })
            .andWhere('lessons.lesson_type = :lesson_type', { lesson_type: 'lecture'})
            .andWhere('contents.id IS NOT NULL');
    return query.getMany();
  }
  /**
   * Find all course
   *
   * @function
   */
  async findAllCourseWithQuizWhereParentWithQuestions(where: any = {}): Promise<Course[]> {
    let query = await this.courseRepository.createQueryBuilder('courses');
    query = await query.leftJoinAndSelect('courses.playlists', 'playlists', 'courses.id = playlists.course_id')
            .leftJoinAndSelect('playlists.lessons', 'lessons', 'playlists.id = lessons.playlist_id')
            .leftJoinAndSelect('lessons.questions', 'quiz_questions', 'lessons.id = quiz_questions.quiz_id')
            .where('courses.track_id = :track_id', { track_id: where.track_id })
            .andWhere('lessons.lesson_type = :lesson_type', { lesson_type: 'quiz'})
            .andWhere('quiz_questions.id IS NOT NULL');
    return query.getMany();
  }
  /**
   * Find a course
   *
   * @function
   */
  findOne(where: object = {}): Promise<Course> {
    where = {
      ...where,
      deleted_at: null,
    };
    return this.courseRepository.findOne({where, relations: ['track', 'playlists']});
  }
  /**
   * Find a course
   *
   * @function
   */
  findOneWithTrash(where: object = {}): Promise<Course> {
    return this.courseRepository.findOne({where, relations: ['track']});
  }

  /**
   * Create a course
   *
   * @function
   */
  create(course: Course): Promise<Course> {
    return this.courseRepository
      .findOne({ id: course.id })
      // .exec()
      .then(async dbCourse => {
        // We check if a course already exists.
        // If it does don't create a new one.
        if (dbCourse) {
          return Promise.reject({message: 'Course is already exist ' + dbCourse.deleted_at ? '' : 'in the trash'});
        }
        return Promise.resolve(
          await this.courseRepository.save(course),
        );
      })
      .catch(error => Promise.reject(error));
  }
  /**
   * Seed all courses.
   *
   * @function
   */
  createMultiple(courses: Course[]): Array<Promise<Course>> {
    return courses.map(async (course: ICourse) => {
      return await this.courseRepository
        .findOne({ id: course.id })
        // .exec()
        .then(async dbCourse => {
          // We check if a course already exists.
          // If it does don't create a new one.
          if (dbCourse) {
            return Promise.reject({message: 'Course is already exist ' + dbCourse.deleted_at ? '' : 'in the trash'});
          }
          return Promise.resolve(
            await this.courseRepository.save(course),
          );
        })
        .catch(error => Promise.reject(error));
    });
  }

  /**
   * Update a course
   *
   * @function
   */
  async update(id: string, newData: any): Promise<Course> {
    const oldData = await this.courseRepository.findOne({ id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'Course is not exist'});
    }

    const updated: Course = Object.assign(oldData, newData);
    return this.courseRepository.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

  /**
   * Delete a course
   *
   * @function
   */
  async delete(id: string): Promise<Course | DeleteResult> {
    const oldData = await this.courseRepository.findOne({ id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'Course is not exist'});
    }
    if (oldData.deleted_at) {
      return Promise.reject({statusCode: 404, message: 'Course is already in the trash'});
    }

    const updated: Course = Object.assign(oldData, {deleted_at: new Date(Date.now())});
    return this.courseRepository.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

  /**
   * Delete a course
   *
   * @function
   */
  async restore(id: string): Promise<Course | DeleteResult> {
    const oldData = await this.courseRepository.findOne({ id });
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'Course is not exist'});
    }
    if (!oldData.deleted_at) {
      return Promise.reject({statusCode: 404, message: 'Course cannot be found in the trash'});
    }

    const updated: Course = Object.assign(oldData, {deleted_at: null});
    return this.courseRepository.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

  /**
   * Delete a course
   *
   * @function
   */
  async forceDelete(id: string): Promise<Course | DeleteResult> {
    const oldData = await this.courseRepository.findOne({ id });
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'Course is not exist'});
    }
    if (!oldData.deleted_at) {
      return Promise.reject({statusCode: 404, message: 'Course cannot be found in the trash'});
    }

    return this.courseRepository.delete({id})
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

  async changeOrder(data: any): Promise<any> {
    const oldData = await this.courseRepository.findOne({id : data.id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'Track is not exist'});
    }
    const newData = {
      ...oldData,
      sort_order : data.sort_order,
    };
    const updated: Course = Object.assign(oldData, newData);

    return this.courseRepository.save(updated)
    .then(res => Promise.resolve(res))
    .catch(error => Promise.reject(error));
  }

    /**
     * Find Course between Order
     *
     * @function
     */
  async findBetween(from: any, to: any, id: string): Promise<any> {
    return this.courseRepository.find({
      where: {
        sort_order: Between(from, to),
        track_id : id,
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
  async replaceOrderBetween(id: string, operation: string, from: number, to: number): Promise<any> {
    const varbebas = '"sort_order" ' + (operation === 'minus' ? '-1' : '+1');
    return this.courseRepository.createQueryBuilder().update(Course).set({
      sort_order : () => varbebas,
    }).where('sort_order BETWEEN :from AND :to', {
      from, to,
    }).andWhere('track_id = :id', {
      id,
    }).execute();
  }

  /**
   * Find Track between Order
   *
   * @function
   */
  async getOneOrder( id: string, order: string): Promise<any> {
    return this.courseRepository.find({
      select : ['id', 'sort_order'],
      where: {
        track_id : id,
      },
      order : {
        sort_order : order === 'DESC' ? 'DESC' : 'ASC',
      },
      take : 1,
    })
    .then(res => Promise.resolve(res))
    .catch(error => Promise.reject(error));
  }

  async changeApproval(id: string, data: any): Promise<object> {
    const oldData = await this.courseRepository.findOne({ id });
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'Course is not exist'});
    }

    const updated: Course = Object.assign(oldData, {approved: data.approved});
    return this.courseRepository.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

  async changePublication(id: string, data: any): Promise<object> {
    const oldData = await this.courseRepository.findOne({ id });
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'Course is not exist'});
    }

    const updated: Course = Object.assign(oldData, {published: data.published});
    return this.courseRepository.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

  async getListByIds(ids: string[]) {
    if (ids.length === 0) {
      ids.push(null);
    }
    let query = await this.courseRepository.createQueryBuilder('courses');
    query = await query.leftJoinAndSelect('courses.playlists', 'playlists', 'playlists.course_id=courses.id')

    query = await query.where('courses.id IN (:...valueIds)', {valueIds: ids});
    return await query.getMany();
  }
}
