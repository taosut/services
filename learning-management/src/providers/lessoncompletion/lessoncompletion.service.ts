import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessonCompletion } from '../../models/lessoncompletion/lessoncompletion.entity';
import { Repository, DeleteResult, Not, IsNull } from 'typeorm';
import { ILessonCompletion } from '../../models/lessoncompletion/lessoncompletion.interface';
import { Lesson } from 'src/models/lesson/lesson.entity';
/**
 * Service dealing with lessoncompletion based operations.
 *
 * @class
 */
@Injectable()
export class LessonCompletionService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {Repository<LessonCompletion>} lessoncompletionRepository
   */
  constructor(
    @InjectRepository(LessonCompletion)
    private readonly lessoncompletionRepository: Repository<LessonCompletion>,
  ) {}
  /**
   * Find all lessoncompletion
   *
   * @function
   */
  async findAll(filters: any = {}): Promise<LessonCompletion[]> {
    let query = await this.lessoncompletionRepository.createQueryBuilder('lesson_completions');
    if (filters.keyword) {
      query = await query.where('lesson_completions.title ILIKE :keyword OR lesson_completions.description ILIKE :keyword ',
                                { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('lesson_completions.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('lesson_completions.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('lesson_completions.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
        }
      }
    }
    return query.getMany();
  }
  /**
   * Find all lessoncompletion
   *
   * @function
   */
  async findAllWhereParent(where: any = {}): Promise<LessonCompletion[]> {
    let query = await this.lessoncompletionRepository.createQueryBuilder('lesson_completions');
    query = await query.leftJoinAndSelect('lesson_completions.lesson', 'lessons',
            'lesson_completions.lesson_id = lessons.id AND lessons.playlist_id = :playlist_id',
            { playlist_id: where.playlist_id })
            .where('lesson_completions.user_id = :user_id', { user_id: where.user_id })
            .andWhere('lessons.id IS NOT NULL');
    return query.getMany();
  }
  /**
   * Find all lessoncompletion with pagination
   *
   * @function
   */
  async findAllWithPagination(filters: any = {}): Promise<LessonCompletion[]> {
    let page = 1;
    let perPage = 5;
    if (filters.page) {
      page = filters.page;
    }
    if (filters.per_page) {
      perPage = filters.per_page;
    }
    let query = await this.lessoncompletionRepository
                  .createQueryBuilder('lesson_completions');

    if (filters.keyword) {
      query = await query.where('lesson_completions.title ILIKE :keyword OR lesson_completions.description ILIKE :keyword ',
                                { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('lesson_completions.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('lesson_completions.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('lesson_completions.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
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
   * Find a lessoncompletion
   *
   * @function
   */
  async findOne(where: object = {}): Promise<LessonCompletion> {
    return await this.lessoncompletionRepository.findOne({where});
  }
  /**
   * Find a lessoncompletion
   *
   * @function
   */
  findOneWithTrash(where: object = {}): Promise<LessonCompletion> {
    return this.lessoncompletionRepository.findOne({where});
  }

  /**
   * Create a lessoncompletion
   *
   * @function
   */
  create(lessoncompletion: LessonCompletion): Promise<LessonCompletion> {
    return this.lessoncompletionRepository
      .findOne({ id: lessoncompletion.id })
      // .exec()
      .then(async dbLessonCompletion => {
        // We check if a lessoncompletion already exists.
        // If it does don't create a new one.
        if (dbLessonCompletion) {
          return Promise.reject({message: 'LessonCompletion is already exist.'});
        }
        return Promise.resolve(
          await this.lessoncompletionRepository.save(lessoncompletion),
        );
      })
      .catch(error => Promise.reject(error));
  }
  /**
   * Seed all lessoncompletions.
   *
   * @function
   */
  createMultiple(lessoncompletions: LessonCompletion[]): Array<Promise<LessonCompletion>> {
    return lessoncompletions.map(async (lessoncompletion: ILessonCompletion) => {
      return await this.lessoncompletionRepository
        .findOne({ id: lessoncompletion.id })
        // .exec()
        .then(async dbLessonCompletion => {
          // We check if a lessoncompletion already exists.
          // If it does don't create a new one.
          if (dbLessonCompletion) {
            return Promise.reject({message: 'LessonCompletion is already exist.'});
          }
          return Promise.resolve(
            await this.lessoncompletionRepository.save(lessoncompletion),
          );
        })
        .catch(error => Promise.reject(error));
    });
  }

  /**
   * Update a lessoncompletion
   *
   * @function
   */
  async update(id: string, newData: any): Promise<LessonCompletion> {
    const oldData = await this.lessoncompletionRepository.findOne({id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'LessonCompletion is not exist'});
    }
    const updated: LessonCompletion = Object.assign(oldData, newData);
    return this.lessoncompletionRepository.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }
  /**
   * Delete a lessoncompletion
   *
   * @function
   */
  async forceDelete(id: string): Promise<LessonCompletion | DeleteResult> {
    const oldData = await this.lessoncompletionRepository.findOne({id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'LessonCompletion is not exist'});
    }
    return this.lessoncompletionRepository.delete({id})
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }
}
