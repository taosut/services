import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizAttempt } from '../../models/quizattempt/quizattempt.entity';
import { Repository, DeleteResult, Not, IsNull } from 'typeorm';
import { IQuizAttempt } from '../../models/quizattempt/quizattempt.interface';
/**
 * Service dealing with quizattempt based operations.
 *
 * @class
 */
@Injectable()
export class QuizAttemptService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {Repository<QuizAttempt>} quizAttemptRepository
   */
  constructor(
    @InjectRepository(QuizAttempt)
    private readonly quizAttemptRepository: Repository<QuizAttempt>,
  ) {}
  /**
   * Find all quizattempt
   *
   * @function
   */
  async findAll(filters: any = {}): Promise<QuizAttempt[]> {
    let query = await this.quizAttemptRepository.createQueryBuilder('quiz_attempts');
    if (filters.keyword) {
      query = await query.where('quiz_attempts.title ILIKE :keyword OR quiz_attempts.description ILIKE :keyword ',
              { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('quiz_attempts.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('quiz_attempts.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('quiz_attempts.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
        }
      }
    }
    return query.getMany();
  }
  /**
   * Find all quizattempt with pagination
   *
   * @function
   */
  async findAllWithPagination(filters: any = {}): Promise<QuizAttempt[]> {
    let page = 1;
    let perPage = 5;
    if (filters.page) {
      page = filters.page;
    }
    if (filters.per_page) {
      perPage = filters.per_page;
    }
    let query = await this.quizAttemptRepository
                  .createQueryBuilder('quiz_attempts');

    if (filters.keyword) {
      query = await query.where('quiz_attempts.title ILIKE :keyword OR quiz_attempts.description ILIKE :keyword ',
              { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('quiz_attempts.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('quiz_attempts.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('quiz_attempts.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
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
   * Find all quizAttempt
   *
   * @function
   */
  async findAllWhereParent(where: any = {}): Promise<QuizAttempt[]> {
    let query = await this.quizAttemptRepository.createQueryBuilder('quiz_attempt');
    query = await query.leftJoinAndSelect('quiz_attempt.quiz', 'lessons',
            'quiz_attempt.quiz_id = lessons.id AND lessons.playlist_id = :playlist_id',
            { playlist_id: where.playlist_id })
            .where('quiz_attempt.user_id = :user_id', { user_id: where.user_id });
    return query.getMany();
  }
  /**
   * Find a quizattempt
   *
   * @function
   */
  findOne(where: object = {}): Promise<QuizAttempt> {
    where = {
      ...where,
    };
    return this.quizAttemptRepository.findOne({where,
            relations: ['quiz', 'attempt_details', 'attempt_details.quiz_question', 'attempt_details.quiz_question.answers']});
  }
  /**
   * Find a quizattempt
   *
   * @function
   */
  findOneWithTrash(where: object = {}): Promise<QuizAttempt> {
    return this.quizAttemptRepository.findOne({where, relations: ['quiz', 'attempt_details']});
  }

  /**
   * Create a quizattempt
   *
   * @function
   */
  create(quizattempt: QuizAttempt): Promise<QuizAttempt> {
    return this.quizAttemptRepository
      .findOne({ id: quizattempt.id })
      // .exec()
      .then(async dbQuizAttempt => {
        // We check if a quizattempt already exists.
        // If it does don't create a new one.
        if (dbQuizAttempt) {
          return Promise.reject({message: 'QuizAttempt is already exist.'});
        }
        return Promise.resolve(
          await this.quizAttemptRepository.save(quizattempt),
        );
      })
      .catch(error => Promise.reject(error));
  }
  /**
   * Seed all quizattempts.
   *
   * @function
   */
  async createMultiple(quizattempts: QuizAttempt[]): Promise<Array<Promise<QuizAttempt>>> {
    return await quizattempts.map(async (quizattempt: IQuizAttempt) => {
      return await this.quizAttemptRepository
        .findOne({ id: quizattempt.id })
        // .exec()
        .then(async dbQuizAttempt => {
          // We check if a quizattempt already exists.
          // If it does don't create a new one.
          if (dbQuizAttempt) {
            return Promise.reject({message: 'QuizAttempt is already exist.'});
          }
          return Promise.resolve(
            await this.quizAttemptRepository.save(quizattempt),
          );
        })
        .catch(error => Promise.reject(error));
    });
  }

  /**
   * Update a quizattempt
   *
   * @function
   */
  async update(id: string, newData: any): Promise<QuizAttempt> {
    const oldData = await this.quizAttemptRepository.findOne({id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'QuizAttempt is not exist'});
    }

    const updated: QuizAttempt = Object.assign(oldData, newData);
    return this.quizAttemptRepository.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

  /**
   * Delete a quizattempt
   *
   * @function
   */
  async forceDelete(id: string): Promise<QuizAttempt | DeleteResult> {
    const oldData = await this.quizAttemptRepository.findOne({id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'QuizAttempt is not exist'});
    }

    return this.quizAttemptRepository.delete({id})
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

}
