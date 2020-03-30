import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FinalExamQuestion } from '../../models/final_exam_question/final_exam_question.entity';
import { Repository, DeleteResult, Not, IsNull } from 'typeorm';
import { IFinalExamQuestion } from '../../models/final_exam_question/final_exam_question.interface';
/**
 * Service dealing with final_exam_question based operations.
 *
 * @class
 */
@Injectable()
export class FinalExamQuestionService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {Repository<FinalExamQuestion>} finalExamQuestionRepository
   */
  constructor(
    @InjectRepository(FinalExamQuestion)
    private readonly finalExamQuestionRepository: Repository<FinalExamQuestion>,
  ) {}
  /**
   * Find all final_exam_question
   *
   * @function
   */
  async findAll(filters: any = {}): Promise<FinalExamQuestion[]> {
    let query = await this.finalExamQuestionRepository.createQueryBuilder('final_exam_questions')
                      .leftJoinAndSelect('final_exam_questions.answers', 'final_exam_answers');
    if (filters.keyword) {
      query = await query.where('final_exam_questions.title ILIKE :keyword OR final_exam_questions.description ILIKE :keyword ',
              { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('final_exam_questions.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('final_exam_questions.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('final_exam_questions.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
        }
      }
    }
    return query.getMany();
  }
  /**
   * Find all final_exam_question with pagination
   *
   * @function
   */
  async findAllWithPagination(filters: any = {}): Promise<FinalExamQuestion[]> {
    let page = 1;
    let perPage = 5;
    if (filters.page) { page = filters.page; }
    if (filters.per_page) { perPage = filters.per_page; }

    let query = await this.finalExamQuestionRepository
                  .createQueryBuilder('final_exam_questions')
                  .leftJoinAndSelect('final_exam_questions.answers', 'final_exam_answers');

    if (filters.keyword) {
      query = await query.where('final_exam_questions.title ILIKE :keyword OR final_exam_questions.description ILIKE :keyword ',
              { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('final_exam_questions.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('final_exam_questions.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('final_exam_questions.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
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
   * Find a final_exam_question
   *
   * @function
   */
  findOne(where: object = {}): Promise<FinalExamQuestion> {
    where = {
      ...where,
      deleted_at: null,
    };
    return this.finalExamQuestionRepository.findOne({where, relations: ['final_exam', 'answers']});
  }
  /**
   * Find a final_exam_question
   *
   * @function
   */
  findOneWithTrash(where: object = {}): Promise<FinalExamQuestion> {
    return this.finalExamQuestionRepository.findOne({where, relations: ['final_exam', 'answers']});
  }

  /**
   * Create a finalExamQuestion
   *
   * @function
   */
  create(finalExamQuestion: FinalExamQuestion): Promise<FinalExamQuestion> {
    return this.finalExamQuestionRepository
      .findOne({ id: finalExamQuestion.id })
      // .exec()
      .then(async dbFinalExamQuestion => {
        // We check if a finalExamQuestion already exists.
        // If it does don't create a new one.
        if (dbFinalExamQuestion) {
          return Promise.reject({message: 'FinalExamQuestion is already exist ' + dbFinalExamQuestion.deleted_at ? '' : 'in the trash'});
        }
        return Promise.resolve(
          await this.finalExamQuestionRepository.save(finalExamQuestion),
        );
      })
      .catch(error => Promise.reject(error));
  }
  /**
   * Seed all finalExamQuestions.
   *
   * @function
   */
  createMultiple(finalExamQuestions: FinalExamQuestion[]): Array<Promise<FinalExamQuestion>> {
    return finalExamQuestions.map(async (finalExamQuestion: IFinalExamQuestion) => {
      return await this.finalExamQuestionRepository
        .findOne({ id: finalExamQuestion.id })
        // .exec()
        .then(async dbFinalExamQuestion => {
          // We check if a finalExamQuestion already exists.
          // If it does don't create a new one.
          if (dbFinalExamQuestion) {
            return Promise.reject({message: 'FinalExamQuestion is already exist ' + dbFinalExamQuestion.deleted_at ? '' : 'in the trash'});
          }
          return Promise.resolve(
            await this.finalExamQuestionRepository.save(finalExamQuestion),
          );
        })
        .catch(error => Promise.reject(error));
    });
  }

  /**
   * Update a finalExamQuestion
   *
   * @function
   */
  async update(id: string, newData: any): Promise<FinalExamQuestion> {
    const oldData = await this.finalExamQuestionRepository.findOne({ id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'FinalExamQuestion is not exist'});
    }

    const updated: FinalExamQuestion = Object.assign(oldData, newData);
    return this.finalExamQuestionRepository.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

  /**
   * Delete a finalExamQuestion
   *
   * @function
   */
  async delete(id: string): Promise<FinalExamQuestion | DeleteResult> {
    const oldData = await this.finalExamQuestionRepository.findOne({ id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'FinalExamQuestion is not exist'});
    }
    if (oldData.deleted_at) {
      return Promise.reject({statusCode: 404, message: 'FinalExamQuestion is already in the trash'});
    }

    const updated: FinalExamQuestion = Object.assign(oldData, {deleted_at: new Date(Date.now())});
    return this.finalExamQuestionRepository.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

  /**
   * Delete a finalExamQuestion
   *
   * @function
   */
  async restore(id: string): Promise<FinalExamQuestion | DeleteResult> {
    const oldData = await this.finalExamQuestionRepository.findOne({ id });
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'FinalExamQuestion is not exist'});
    }
    if (!oldData.deleted_at) {
      return Promise.reject({statusCode: 404, message: 'FinalExamQuestion cannot be found in the trash'});
    }

    const updated: FinalExamQuestion = Object.assign(oldData, {deleted_at: null});
    return this.finalExamQuestionRepository.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

  /**
   * Delete a finalExamQuestion
   *
   * @function
   */
  async forceDelete(id: string): Promise<FinalExamQuestion | DeleteResult> {
    const oldData = await this.finalExamQuestionRepository.findOne({ id });
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'FinalExamQuestion is not exist'});
    }
    if (!oldData.deleted_at) {
      return Promise.reject({statusCode: 404, message: 'FinalExamQuestion cannot be found in the trash'});
    }

    return this.finalExamQuestionRepository.delete({id})
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }
}
