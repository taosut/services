import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FinalExamAnswer } from '../../models/final_exam_answer/final_exam_answer.entity';
import { Repository, DeleteResult, Not, IsNull } from 'typeorm';
import { IFinalExamAnswer } from '../../models/final_exam_answer/final_exam_answer.interface';
/**
 * Service dealing with final_exam_answer based operations.
 *
 * @class
 */
@Injectable()
export class FinalExamAnswerService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {Repository<FinalExamAnswer>} finalExamAnswerRepository
   */
  constructor(
    @InjectRepository(FinalExamAnswer)
    private readonly finalExamAnswerRepository: Repository<FinalExamAnswer>,
  ) {}
  /**
   * Find all final_exam_answer
   *
   * @function
   */
  async findAll(filters: any = {}): Promise<FinalExamAnswer[]> {
    let query = await this.finalExamAnswerRepository.createQueryBuilder('final_exam_answers');
    if (filters.keyword) {
      query = await query.where('final_exam_answers.title ILIKE :keyword OR final_exam_answers.description ILIKE :keyword ',
              { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('final_exam_answers.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('final_exam_answers.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('final_exam_answers.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
        }
      }
    }
    return query.getMany();
  }
  /**
   * Find all final_exam_answer with pagination
   *
   * @function
   */
  async findAllWithPagination(filters: any = {}): Promise<FinalExamAnswer[]> {
    let page = 1;
    let perPage = 5;
    if (filters.page) { page = filters.page; }
    if (filters.per_page) { perPage = filters.per_page; }

    let query = await this.finalExamAnswerRepository
                  .createQueryBuilder('final_exam_answers');

    if (filters.keyword) {
      query = await query.where('final_exam_answers.title ILIKE :keyword OR final_exam_answers.description ILIKE :keyword ',
              { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('final_exam_answers.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('final_exam_answers.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('final_exam_answers.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
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
   * Find a final_exam_answer
   *
   * @function
   */
  findOne(where: object = {}): Promise<FinalExamAnswer> {
    where = {
      ...where,
    };
    return this.finalExamAnswerRepository.findOne({where, relations: ['final_exam', 'answers']});
  }

  /**
   * Create a final_exam_answer
   *
   * @function
   */
  create(finalExamAnswer: FinalExamAnswer): Promise<FinalExamAnswer> {
    return this.finalExamAnswerRepository
      .findOne({ id: finalExamAnswer.id })
      // .exec()
      .then(async dbFinalExamAnswer => {
        // We check if a finalExamAnswer already exists.
        // If it does don't create a new one.
        if (dbFinalExamAnswer) {
          return Promise.reject({message: 'FinalExamAnswer is already exist'});
        }
        return Promise.resolve(
          await this.finalExamAnswerRepository.save(finalExamAnswer),
        );
      })
      .catch(error => Promise.reject(error));
  }
  /**
   * Seed all finalExamAnswers.
   *
   * @function
   */
  createMultiple(finalExamAnswers: FinalExamAnswer[]): Array<Promise<FinalExamAnswer>> {
    return finalExamAnswers.map(async (finalExamAnswer: IFinalExamAnswer) => {
      return await this.finalExamAnswerRepository
        .findOne({ id: finalExamAnswer.id })
        // .exec()
        .then(async dbFinalExamAnswer => {
          // We check if a finalExamAnswer already exists.
          // If it does don't create a new one.
          if (dbFinalExamAnswer) {
            return Promise.reject({message: 'FinalExamAnswer is already exist '});
          }
          return Promise.resolve(
            await this.finalExamAnswerRepository.save(finalExamAnswer),
          );
        })
        .catch(error => Promise.reject(error));
    });
  }

  /**
   * Update a finalExamAnswer
   *
   * @function
   */
  async update(id: string, newData: any): Promise<FinalExamAnswer> {
    const oldData = await this.finalExamAnswerRepository.findOne({ id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'FinalExamAnswer is not exist'});
    }

    const updated: FinalExamAnswer = Object.assign(oldData, newData);
    return this.finalExamAnswerRepository.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }
  /**
   * Delete a finalExamAnswer
   *
   * @function
   */
  async forceDelete(id: string): Promise<FinalExamAnswer | DeleteResult> {
    const oldData = await this.finalExamAnswerRepository.findOne({ id });
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'FinalExamAnswer is not exist'});
    }

    return this.finalExamAnswerRepository.delete({id})
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }
}
