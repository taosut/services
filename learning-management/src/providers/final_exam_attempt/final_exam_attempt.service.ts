import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FinalExamAttempt } from '../../models/final_exam_attempt/final_exam_attempt.entity';
import { Repository, DeleteResult, Not, IsNull } from 'typeorm';
import { IFinalExamAttempt } from '../../models/final_exam_attempt/final_exam_attempt.interface';
/**
 * Service dealing with final_exam_attempt based operations.
 *
 * @class
 */
@Injectable()
export class FinalExamAttemptService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {Repository<FinalExamAttempt>} finalExamAttemptRepository
   */
  constructor(
    @InjectRepository(FinalExamAttempt)
    private readonly finalExamAttemptRepository: Repository<FinalExamAttempt>,
  ) {}
  /**
   * Find all final_exam_attempt
   *
   * @function
   */
  async findAll(filters: any = {}): Promise<FinalExamAttempt[]> {
    let query = await this.finalExamAttemptRepository.createQueryBuilder('final_exam_attempts');
    if (filters.keyword) {
      query = await query.where('final_exam_attempts.title ILIKE :keyword OR final_exam_attempts.description ILIKE :keyword ',
              { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('final_exam_attempts.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('final_exam_attempts.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('final_exam_attempts.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
        }
      }
    }
    return query.getMany();
  }
  /**
   * Find all final_exam_attempt with pagination
   *
   * @function
   */
  async findAllWithPagination(filters: any = {}): Promise<FinalExamAttempt[]> {
    let page = 1;
    let perPage = 5;
    if (filters.page) {
      page = filters.page;
    }
    if (filters.per_page) {
      perPage = filters.per_page;
    }
    let query = await this.finalExamAttemptRepository
                  .createQueryBuilder('final_exam_attempts');

    if (filters.keyword) {
      query = await query.where('final_exam_attempts.title ILIKE :keyword OR final_exam_attempts.description ILIKE :keyword ',
              { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('final_exam_attempts.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('final_exam_attempts.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('final_exam_attempts.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
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
  async findAllWhereParent(where: any = {}): Promise<FinalExamAttempt[]> {
    let query = await this.finalExamAttemptRepository.createQueryBuilder('final_exam_attempts');
    // query = await query.leftJoinAndSelect('final_exam_attempt.final_exam', 'final_exams',
    //         'final_exam_attempt.final_exam_id = final_exams.id AND final_exams.playlist_id = :playlist_id',
    //         { playlist_id: where.playlist_id })
    query = await query.where('final_exam_attempt.user_id = :user_id', { user_id: where.user_id });
    return query.getMany();
  }
  /**
   * Find a final_exam_attempt
   *
   * @function
   */
  findOne(where: object = {}): Promise<FinalExamAttempt> {
    where = {
      ...where,
    };
    return this.finalExamAttemptRepository.findOne({where,
            relations: ['final_exam', 'attempt_details', 'attempt_details.final_exam_question', 'attempt_details.final_exam_question.answers']});
  }
  /**
   * Find a final_exam_attempt
   *
   * @function
   */
  findOneWithTrash(where: object = {}): Promise<FinalExamAttempt> {
    return this.finalExamAttemptRepository.findOne({where, relations: ['final_exam', 'attempt_details']});
  }

  /**
   * Create a finalExamAttempt
   *
   * @function
   */
  create(finalExamAttempt: FinalExamAttempt): Promise<FinalExamAttempt> {
    return this.finalExamAttemptRepository
      .findOne({ id: finalExamAttempt.id })
      // .exec()
      .then(async dbFinalExamAttempt => {
        // We check if a finalExamAttempt already exists.
        // If it does don't create a new one.
        if (dbFinalExamAttempt) {
          return Promise.reject({message: 'FinalExamAttempt is already exist.'});
        }
        return Promise.resolve(
          await this.finalExamAttemptRepository.save(finalExamAttempt),
        );
      })
      .catch(error => Promise.reject(error));
  }
  /**
   * Seed all finalExamAttempts.
   *
   * @function
   */
  async createMultiple(finalExamAttempts: FinalExamAttempt[]): Promise<Array<Promise<FinalExamAttempt>>> {
    return await finalExamAttempts.map(async (finalExamAttempt: IFinalExamAttempt) => {
      return await this.finalExamAttemptRepository
        .findOne({ id: finalExamAttempt.id })
        // .exec()
        .then(async dbFinalExamAttempt => {
          // We check if a finalExamAttempt already exists.
          // If it does don't create a new one.
          if (dbFinalExamAttempt) {
            return Promise.reject({message: 'FinalExamAttempt is already exist.'});
          }
          return Promise.resolve(
            await this.finalExamAttemptRepository.save(finalExamAttempt),
          );
        })
        .catch(error => Promise.reject(error));
    });
  }

  /**
   * Update a finalExamAttempt
   *
   * @function
   */
  async update(id: string, newData: any): Promise<FinalExamAttempt> {
    const oldData = await this.finalExamAttemptRepository.findOne({id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'FinalExamAttempt is not exist'});
    }

    const updated: FinalExamAttempt = Object.assign(oldData, newData);
    return this.finalExamAttemptRepository.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

  /**
   * Delete a finalExamAttempt
   *
   * @function
   */
  async forceDelete(id: string): Promise<FinalExamAttempt | DeleteResult> {
    const oldData = await this.finalExamAttemptRepository.findOne({id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'FinalExamAttempt is not exist'});
    }

    return this.finalExamAttemptRepository.delete({id})
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

}
