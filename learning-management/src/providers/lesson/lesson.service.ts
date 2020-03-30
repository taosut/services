import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from '../../models/lesson/lesson.entity';
import { Repository, DeleteResult, Between, Not, IsNull } from 'typeorm';
import { ILesson } from '../../models/lesson/lesson.interface';
/**
 * Service dealing with lesson based operations.
 *
 * @class
 */
@Injectable()
export class LessonService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {Repository<Lesson>} lessonRepository
   */
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}
  /**
   * Find all lesson
   *
   * @function
   */
  async findAll(filters: any = {}): Promise<Lesson[]> {
    let query = await this.lessonRepository.createQueryBuilder('lessons');
    if (filters.keyword) {
      query = await query.where('lessons.title ILIKE :keyword OR lessons.description ILIKE :keyword ', { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('lessons.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('lessons.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('lessons.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
        }
      }
    }
    if (filters.like) {
      for (const prop in filters.like) {
        if (prop) {
          query = await query.andWhere('lessons.' + prop + ' LIKE :dLike ', { dLike: filters.like[prop] + '%' });
        }
      }
    }
    if (filters.orderBy) {
      for (const orderBy of filters.orderBy) {
        query = await query.addOrderBy(orderBy.column, orderBy.order);
      }
    }
    return query.getMany();
  }
  /**
   * Find all lesson with pagination
   *
   * @function
   */
  async findAllWithPagination(filters: any = {}): Promise<Lesson[]> {
    let page = 1;
    let perPage = 5;
    if (filters.page) {
      page = filters.page;
    }
    if (filters.per_page) {
      perPage = filters.per_page;
    }
    let query = await this.lessonRepository
                  .createQueryBuilder('lessons');

    if (filters.keyword) {
      query = await query.where('lessons.title ILIKE :keyword OR lessons.description ILIKE :keyword ', { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('lessons.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('lessons.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('lessons.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
        }
      }
    }
    if (filters.like) {
      for (const prop in filters.like) {
        if (prop) {
          query = await query.andWhere('lessons.' + prop + ' LIKE :dLike ', { dLike: filters.like[prop] + '%' });
        }
      }
    }
    if (filters.orderBy) {
      for (const orderBy of filters.orderBy) {
        if (!orderBy.column.includes('.')) {
          orderBy.column = 'lessons.' + orderBy.column;
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
   * Find all lesson
   *
   * @function
   */
  async findAllLectureWhereParentWithContent(where: any = {}): Promise<Lesson[]> {
    let query = await this.lessonRepository.createQueryBuilder('lessons');
    query = await query.leftJoinAndSelect('lessons.content', 'contents', 'lessons.id = contents.lesson_id')
            .where('lessons.playlist_id = :playlist_id', { playlist_id: where.playlist_id })
            .andWhere('lessons.lesson_type = :lesson_type', { lesson_type: 'lecture'})
            .andWhere('contents.id IS NOT NULL');
    return query.getMany();
  }
  /**
   * Find all lesson
   *
   * @function
   */
  async findAllQuizWhereParentWithQuestions(where: any = {}): Promise<Lesson[]> {
    let query = await this.lessonRepository.createQueryBuilder('lessons');
    query = await query.select('lessons.*');
    query = await query.leftJoinAndSelect('lessons.questions', 'quiz_questions', 'lessons.id = quiz_questions.quiz_id')
            .where('lessons.playlist_id = :playlist_id', { playlist_id: where.playlist_id })
            .andWhere('lessons.lesson_type = :lesson_type', { lesson_type: 'quiz'});
    return query.getMany();
  }
  /**
   * Find a lesson
   *
   * @function
   */
  async findOne(where: object = {}): Promise<Lesson> {
    where = {
      ...where,
      deleted_at: null,
    };
    const find = await this.lessonRepository.findOne({where});
    let result;
    if (find && find.lesson_type === 'lecture') {
      result = await this.lessonRepository.findOne({where, relations: ['playlist', 'content', 'content.content_attachments']});
    } else if (find && find.lesson_type === 'quiz') {
      result = await this.lessonRepository.findOne({where, relations: ['playlist']});
    }
    return result;
  }
  /**
   * Find a lesson
   *
   * @function
   */
  findOneWithTrash(where: object = {}): Promise<Lesson> {
    return this.lessonRepository.findOne({where, relations: ['playlist', 'content', 'content.content_attachments']});
  }

  /**
   * Create a lesson
   *
   * @function
   */
  create(lesson: Lesson): Promise<Lesson> {
    return this.lessonRepository
      .findOne({ id: lesson.id })
      // .exec()
      .then(async dbLesson => {
        // We check if a lesson already exists.
        // If it does don't create a new one.
        if (dbLesson) {
          return Promise.reject({message: 'Lesson is already exist ' + dbLesson.deleted_at ? '' : 'in the trash'});
        }
        return Promise.resolve(
          await this.lessonRepository.save(lesson),
        );
      })
      .catch(error => Promise.reject(error));
  }
  /**
   * Seed all lessons.
   *
   * @function
   */
  createMultiple(lessons: Lesson[]): Array<Promise<Lesson>> {
    return lessons.map(async (lesson: ILesson) => {
      return await this.lessonRepository
        .findOne({ id: lesson.id })
        // .exec()
        .then(async dbLesson => {
          // We check if a lesson already exists.
          // If it does don't create a new one.
          if (dbLesson) {
            return Promise.reject({message: 'Lesson is already exist ' + dbLesson.deleted_at ? '' : 'in the trash'});
          }
          return Promise.resolve(
            await this.lessonRepository.save(lesson),
          );
        })
        .catch(error => Promise.reject(error));
    });
  }

  /**
   * Update a lesson
   *
   * @function
   */
  async update(id: string, newData: any): Promise<Lesson> {
    const oldData = await this.lessonRepository.findOne({id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'Lesson is not exist'});
    }

    const updated: Lesson = Object.assign(oldData, newData);
    return this.lessonRepository.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

  /**
   * Delete a lesson
   *
   * @function
   */
  async delete(id: string): Promise<Lesson | DeleteResult> {
    const oldData = await this.lessonRepository.findOne({ id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'Lesson is not exist'});
    }
    if (oldData.deleted_at) {
      return Promise.reject({statusCode: 404, message: 'Lesson is already in the trash'});
    }

    const updated: Lesson = Object.assign(oldData, {deleted_at: new Date(Date.now())});
    return this.lessonRepository.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

  /**
   * Delete a lesson
   *
   * @function
   */
  async restore(id: string): Promise<Lesson | DeleteResult> {
    const oldData = await this.lessonRepository.findOne({ id });
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'Lesson is not exist'});
    }
    if (!oldData.deleted_at) {
      return Promise.reject({statusCode: 404, message: 'Lesson cannot be found in the trash'});
    }

    const updated: Lesson = Object.assign(oldData, {deleted_at: null});
    return this.lessonRepository.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

  /**
   * Delete a lesson
   *
   * @function
   */
  async forceDelete(id: string): Promise<Lesson | DeleteResult> {
    const oldData = await this.lessonRepository.findOne({ id });
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'Lesson is not exist'});
    }
    if (!oldData.deleted_at) {
      return Promise.reject({statusCode: 404, message: 'Lesson cannot be found in the trash'});
    }

    return this.lessonRepository.delete({id})
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

  async changeOrder(data: any): Promise<any> {
    const oldData = await this.lessonRepository.findOne({id : data.id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'Lesson is not exist'});
    }
    const newData = {
      ...oldData,
      sort_order : data.sort_order,
    };
    const updated: Lesson = Object.assign(oldData, newData);

    return this.lessonRepository.save(updated)
    .then(res => Promise.resolve(res))
    .catch(error => Promise.reject(error));
  }

  /**
   * Find Lesson between Order
   *
   * @function
   */
  async findBetween(from: any, to: any, id: string): Promise<any> {
    return this.lessonRepository.find({
      where: {
        sort_order: Between(from, to),
        playlist_id : id,
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
    return this.lessonRepository.createQueryBuilder().update(Lesson).set({
      sort_order : () => varbebas,
    }).where('sort_order BETWEEN :from AND :to', {
      from, to,
    }).andWhere('playlist_id = :id', {
      id,
    }).execute();
  }

  /**
   * Find Track between Order
   *
   * @function
   */
  async getOneOrder( id: string, order: string): Promise<any> {
    return this.lessonRepository.find({
      select : ['id', 'sort_order'],
      order : {
        sort_order : order === 'DESC' ? 'DESC' : 'ASC',
      },
      where: {
        playlist_id : id,
      },
      take : 1,
    })
    .then(res => Promise.resolve(res))
    .catch(error => Promise.reject(error));
  }
}
