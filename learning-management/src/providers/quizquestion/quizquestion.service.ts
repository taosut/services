import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizQuestion } from '../../models/quizquestion/quizquestion.entity';
import { Repository, DeleteResult, Not, IsNull } from 'typeorm';
import { IQuizQuestion } from '../../models/quizquestion/quizquestion.interface';
/**
 * Service dealing with quizquestion based operations.
 *
 * @class
 */
@Injectable()
export class QuizQuestionService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {Repository<QuizQuestion>} quizQuestionRepository
   */
  constructor(
    @InjectRepository(QuizQuestion)
    private readonly quizQuestionRepository: Repository<QuizQuestion>,
  ) {}
  /**
   * Find all quizquestion
   *
   * @function
   */
  async findAll(filters: any = {}): Promise<QuizQuestion[]> {
    let query = await this.quizQuestionRepository.createQueryBuilder('quiz_questions')
                      .leftJoinAndSelect('quiz_questions.answers', 'quiz_answers');
    if (filters.keyword) {
      query = await query.where('quiz_questions.title ILIKE :keyword OR quiz_questions.description ILIKE :keyword ',
              { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('quiz_questions.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('quiz_questions.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('quiz_questions.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
        }
      }
    }
    return query.getMany();
  }
  /**
   * Find all quizquestion with pagination
   *
   * @function
   */
  async findAllWithPagination(filters: any = {}): Promise<QuizQuestion[]> {
    let page = 1;
    let perPage = 5;
    if (filters.page) { page = filters.page; }
    if (filters.per_page) { perPage = filters.per_page; }

    let query = await this.quizQuestionRepository
                  .createQueryBuilder('quiz_questions')
                  .leftJoinAndSelect('quiz_questions.answers', 'quiz_answers');

    if (filters.keyword) {
      query = await query.where('quiz_questions.title ILIKE :keyword OR quiz_questions.description ILIKE :keyword ',
              { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('quiz_questions.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('quiz_questions.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('quiz_questions.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
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
   * Find a quizquestion
   *
   * @function
   */
  findOne(where: object = {}): Promise<QuizQuestion> {
    where = {
      ...where,
      deleted_at: null,
    };
    return this.quizQuestionRepository.findOne({where, relations: ['quiz', 'answers']});
  }
  /**
   * Find a quizquestion
   *
   * @function
   */
  findOneWithTrash(where: object = {}): Promise<QuizQuestion> {
    return this.quizQuestionRepository.findOne({where, relations: ['quiz', 'answers']});
  }

  /**
   * Create a quizquestion
   *
   * @function
   */
  create(quizquestion: QuizQuestion): Promise<QuizQuestion> {
    return this.quizQuestionRepository
      .findOne({ id: quizquestion.id })
      // .exec()
      .then(async dbQuizQuestion => {
        // We check if a quizquestion already exists.
        // If it does don't create a new one.
        if (dbQuizQuestion) {
          return Promise.reject({message: 'QuizQuestion is already exist ' + dbQuizQuestion.deleted_at ? '' : 'in the trash'});
        }
        return Promise.resolve(
          await this.quizQuestionRepository.save(quizquestion),
        );
      })
      .catch(error => Promise.reject(error));
  }
  /**
   * Seed all quizquestions.
   *
   * @function
   */
  createMultiple(quizquestions: QuizQuestion[]): Array<Promise<QuizQuestion>> {
    return quizquestions.map(async (quizquestion: IQuizQuestion) => {
      return await this.quizQuestionRepository
        .findOne({ id: quizquestion.id })
        // .exec()
        .then(async dbQuizQuestion => {
          // We check if a quizquestion already exists.
          // If it does don't create a new one.
          if (dbQuizQuestion) {
            return Promise.reject({message: 'QuizQuestion is already exist ' + dbQuizQuestion.deleted_at ? '' : 'in the trash'});
          }
          return Promise.resolve(
            await this.quizQuestionRepository.save(quizquestion),
          );
        })
        .catch(error => Promise.reject(error));
    });
  }

  /**
   * Update a quizquestion
   *
   * @function
   */
  async update(id: string, newData: any): Promise<QuizQuestion> {
    const oldData = await this.quizQuestionRepository.findOne({ id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'QuizQuestion is not exist'});
    }

    const updated: QuizQuestion = Object.assign(oldData, newData);
    return this.quizQuestionRepository.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

  /**
   * Delete a quizquestion
   *
   * @function
   */
  async delete(id: string): Promise<QuizQuestion | DeleteResult> {
    const oldData = await this.quizQuestionRepository.findOne({ id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'QuizQuestion is not exist'});
    }
    if (oldData.deleted_at) {
      return Promise.reject({statusCode: 404, message: 'QuizQuestion is already in the trash'});
    }

    const updated: QuizQuestion = Object.assign(oldData, {deleted_at: new Date(Date.now())});
    return this.quizQuestionRepository.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

  /**
   * Delete a quizquestion
   *
   * @function
   */
  async restore(id: string): Promise<QuizQuestion | DeleteResult> {
    const oldData = await this.quizQuestionRepository.findOne({ id });
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'QuizQuestion is not exist'});
    }
    if (!oldData.deleted_at) {
      return Promise.reject({statusCode: 404, message: 'QuizQuestion cannot be found in the trash'});
    }

    const updated: QuizQuestion = Object.assign(oldData, {deleted_at: null});
    return this.quizQuestionRepository.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

  /**
   * Delete a quizquestion
   *
   * @function
   */
  async forceDelete(id: string): Promise<QuizQuestion | DeleteResult> {
    const oldData = await this.quizQuestionRepository.findOne({ id });
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'QuizQuestion is not exist'});
    }
    if (!oldData.deleted_at) {
      return Promise.reject({statusCode: 404, message: 'QuizQuestion cannot be found in the trash'});
    }

    return this.quizQuestionRepository.delete({id})
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }
}
