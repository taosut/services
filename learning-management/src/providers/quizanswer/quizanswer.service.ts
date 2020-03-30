import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizAnswer } from '../../models/quizanswer/quizanswer.entity';
import { Repository, DeleteResult, Not, IsNull } from 'typeorm';
import { IQuizAnswer } from '../../models/quizanswer/quizanswer.interface';
/**
 * Service dealing with quizanswer based operations.
 *
 * @class
 */
@Injectable()
export class QuizAnswerService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {Repository<QuizAnswer>} quizQuestionRepository
   */
  constructor(
    @InjectRepository(QuizAnswer)
    private readonly quizQuestionRepository: Repository<QuizAnswer>,
  ) {}
  /**
   * Find all quizanswer
   *
   * @function
   */
  async findAll(filters: any = {}): Promise<QuizAnswer[]> {
    let query = await this.quizQuestionRepository.createQueryBuilder('quiz_answers');
    if (filters.keyword) {
      query = await query.where('quiz_answers.title ILIKE :keyword OR quiz_answers.description ILIKE :keyword ',
              { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('quiz_answers.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('quiz_answers.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('quiz_answers.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
        }
      }
    }
    return query.getMany();
  }
  /**
   * Find all quizanswer with pagination
   *
   * @function
   */
  async findAllWithPagination(filters: any = {}): Promise<QuizAnswer[]> {
    let page = 1;
    let perPage = 5;
    if (filters.page) { page = filters.page; }
    if (filters.per_page) { perPage = filters.per_page; }

    let query = await this.quizQuestionRepository
                  .createQueryBuilder('quiz_answers');

    if (filters.keyword) {
      query = await query.where('quiz_answers.title ILIKE :keyword OR quiz_answers.description ILIKE :keyword ',
              { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('quiz_answers.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('quiz_answers.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('quiz_answers.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
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
   * Find a quizanswer
   *
   * @function
   */
  findOne(where: object = {}): Promise<QuizAnswer> {
    where = {
      ...where,
    };
    return this.quizQuestionRepository.findOne({where, relations: ['quiz', 'answers']});
  }

  /**
   * Create a quizanswer
   *
   * @function
   */
  create(quizanswer: QuizAnswer): Promise<QuizAnswer> {
    return this.quizQuestionRepository
      .findOne({ id: quizanswer.id })
      // .exec()
      .then(async dbQuizAnswer => {
        // We check if a quizanswer already exists.
        // If it does don't create a new one.
        if (dbQuizAnswer) {
          return Promise.reject({message: 'QuizAnswer is already exist'});
        }
        return Promise.resolve(
          await this.quizQuestionRepository.save(quizanswer),
        );
      })
      .catch(error => Promise.reject(error));
  }
  /**
   * Seed all quizanswers.
   *
   * @function
   */
  createMultiple(quizanswers: QuizAnswer[]): Array<Promise<QuizAnswer>> {
    return quizanswers.map(async (quizanswer: IQuizAnswer) => {
      return await this.quizQuestionRepository
        .findOne({ id: quizanswer.id })
        // .exec()
        .then(async dbQuizAnswer => {
          // We check if a quizanswer already exists.
          // If it does don't create a new one.
          if (dbQuizAnswer) {
            return Promise.reject({message: 'QuizAnswer is already exist '});
          }
          return Promise.resolve(
            await this.quizQuestionRepository.save(quizanswer),
          );
        })
        .catch(error => Promise.reject(error));
    });
  }

  /**
   * Update a quizanswer
   *
   * @function
   */
  async update(id: string, newData: any): Promise<QuizAnswer> {
    const oldData = await this.quizQuestionRepository.findOne({ id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'QuizAnswer is not exist'});
    }

    const updated: QuizAnswer = Object.assign(oldData, newData);
    return this.quizQuestionRepository.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }
  /**
   * Delete a quizanswer
   *
   * @function
   */
  async forceDelete(id: string): Promise<QuizAnswer | DeleteResult> {
    const oldData = await this.quizQuestionRepository.findOne({ id });
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'QuizAnswer is not exist'});
    }

    return this.quizQuestionRepository.delete({id})
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }
}
