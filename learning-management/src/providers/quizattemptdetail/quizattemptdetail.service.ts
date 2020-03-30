import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizAttemptDetail } from '../../models/quizattemptdetail/quizattemptdetail.entity';
import { Repository, DeleteResult, Not, IsNull } from 'typeorm';
import { IQuizAttemptDetail } from '../../models/quizattemptdetail/quizattemptdetail.interface';
/**
 * Service dealing with quizattemptdetail based operations.
 *
 * @class
 */
@Injectable()
export class QuizAttemptDetailService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {Repository<QuizAttemptDetail>} quizQuestionRepository
   */
  constructor(
    @InjectRepository(QuizAttemptDetail)
    private readonly quizQuestionRepository: Repository<QuizAttemptDetail>,
  ) {}
  /**
   * Find all quizattemptdetail
   *
   * @function
   */
  async findAll(filters: any = {}): Promise<QuizAttemptDetail[]> {
    let query = await this.quizQuestionRepository.createQueryBuilder('quiz_attempt_details');
    if (filters.keyword) {
      query = await query.where('quiz_attempt_details.title ILIKE :keyword OR quiz_attempt_details.description ILIKE :keyword',
              { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('quiz_attempt_details.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('quiz_attempt_details.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('quiz_attempt_details.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
        }
      }
    }
    return query.getMany();
  }
  /**
   * Find all quizattemptdetail with pagination
   *
   * @function
   */
  async findAllWithPagination(filters: any = {}): Promise<QuizAttemptDetail[]> {
    let page = 1;
    let perPage = 5;
    if (filters.page) { page = filters.page; }
    if (filters.per_page) { perPage = filters.per_page; }

    let query = await this.quizQuestionRepository
                  .createQueryBuilder('quiz_attempt_details');

    if (filters.keyword) {
      query = await query.where('quiz_attempt_details.title ILIKE :keyword OR quiz_attempt_details.description ILIKE :keyword ',
              { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('quiz_attempt_details.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('quiz_attempt_details.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('quiz_attempt_details.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
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
   * Find a quizattemptdetail
   *
   * @function
   */
  findOne(where: object = {}): Promise<QuizAttemptDetail> {
    where = {
      ...where,
    };
    return this.quizQuestionRepository.findOne({where, relations: ['quiz']});
  }
  /**
   * Find a quizattemptdetail
   *
   * @function
   */
  findOneWithTrash(where: object = {}): Promise<QuizAttemptDetail> {
    return this.quizQuestionRepository.findOne({where, relations: ['quiz']});
  }

  /**
   * Create a quizattemptdetail
   *
   * @function
   */
  create(quizattemptdetail: QuizAttemptDetail): Promise<QuizAttemptDetail> {
    return this.quizQuestionRepository
      .findOne({ id: quizattemptdetail.id })
      // .exec()
      .then(async dbQuizAttemptDetail => {
        // We check if a quizattemptdetail already exists.
        // If it does don't create a new one.
        if (dbQuizAttemptDetail) {
          return Promise.reject({message: 'QuizAttemptDetail is already exist.'});
        }
        return Promise.resolve(
          await this.quizQuestionRepository.save(quizattemptdetail),
        );
      })
      .catch(error => Promise.reject(error));
  }
  /**
   * Seed all quizattemptdetails.
   *
   * @function
   */
  createMultiple(quizattemptdetails: QuizAttemptDetail[]): Array<Promise<QuizAttemptDetail>> {
    return quizattemptdetails.map(async (quizattemptdetail: IQuizAttemptDetail) => {
      return await this.quizQuestionRepository
        .findOne({ id: quizattemptdetail.id })
        // .exec()
        .then(async dbQuizAttemptDetail => {
          // We check if a quizattemptdetail already exists.
          // If it does don't create a new one.
          if (dbQuizAttemptDetail) {
            return Promise.reject({message: 'QuizAttemptDetail is already exist.'});
          }
          return Promise.resolve(
            await this.quizQuestionRepository.save(quizattemptdetail),
          );
        })
        .catch(error => Promise.reject(error));
    });
  }

  /**
   * Update a quizattemptdetail
   *
   * @function
   */
  async update(id: string, newData: any): Promise<QuizAttemptDetail> {
    const oldData = await this.quizQuestionRepository.findOne({ id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'QuizAttemptDetail is not exist'});
    }

    const updated: QuizAttemptDetail = Object.assign(oldData, newData);
    return this.quizQuestionRepository.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

  /**
   * Delete a quizattemptdetail
   *
   * @function
   */
  async forceDelete(id: string): Promise<QuizAttemptDetail | DeleteResult> {
    const oldData = await this.quizQuestionRepository.findOne({ id });
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'QuizAttemptDetail is not exist'});
    }

    return this.quizQuestionRepository.delete({id})
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }
  /**
   * Delete a quizattemptdetail
   *
   * @function
   */
  async forceDeleteMultiple(ids: string[]): Promise<QuizAttemptDetail | DeleteResult> {
    return this.quizQuestionRepository.delete(ids)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }
}
