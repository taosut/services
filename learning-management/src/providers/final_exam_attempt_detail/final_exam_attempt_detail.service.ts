import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, Not, IsNull } from 'typeorm';
import { FinalExamAttemptDetail } from '../../models/final_exam_attempt_detail/final_exam_attempt_detail.entity';
import { IFinalExamAttemptDetail } from '../../models/final_exam_attempt_detail/final_exam_attempt_detail.interface';
/**
 * Service dealing with final_exam_attempt_detail based operations.
 *
 * @class
 */
@Injectable()
export class FinalExamAttemptDetailService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {Repository<FinalExamAttemptDetail>} finalExamAttemptDetailRepository
   */
  constructor(
    @InjectRepository(FinalExamAttemptDetail)
    private readonly finalExamAttemptDetailRepository: Repository<FinalExamAttemptDetail>,
  ) {}
  /**
   * Find all final_exam_attempt_detail
   *
   * @function
   */
  async findAll(filters: any = {}): Promise<FinalExamAttemptDetail[]> {
    let query = await this.finalExamAttemptDetailRepository.createQueryBuilder('final_exam_attempt_details');
    if (filters.keyword) {
      query = await query.where('final_exam_attempt_details.title ILIKE :keyword OR final_exam_attempt_details.description ILIKE :keyword ',
              { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('final_exam_attempt_details.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('final_exam_attempt_details.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('final_exam_attempt_details.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
        }
      }
    }
    return query.getMany();
  }
  /**
   * Find all final_exam_attempt_detail with pagination
   *
   * @function
   */
  async findAllWithPagination(filters: any = {}): Promise<FinalExamAttemptDetail[]> {
    let page = 1;
    let perPage = 5;
    if (filters.page) { page = filters.page; }
    if (filters.per_page) { perPage = filters.per_page; }

    let query = await this.finalExamAttemptDetailRepository
                  .createQueryBuilder('final_exam_attempt_details');

    if (filters.keyword) {
      query = await query.where('final_exam_attempt_details.title ILIKE :keyword OR final_exam_attempt_details.description ILIKE :keyword ',
              { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('final_exam_attempt_details.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('final_exam_attempt_details.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('final_exam_attempt_details.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
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
   * Find a final_exam_attempt_detail
   *
   * @function
   */
  findOne(where: object = {}): Promise<FinalExamAttemptDetail> {
    where = {
      ...where,
    };
    return this.finalExamAttemptDetailRepository.findOne({where});
  }
  /**
   * Find a final_exam_attempt_detail
   *
   * @function
   */
  findOneWithTrash(where: object = {}): Promise<FinalExamAttemptDetail> {
    return this.finalExamAttemptDetailRepository.findOne({where});
  }

  /**
   * Create a finalExamAttemptDetail
   *
   * @function
   */
  create(finalExamAttemptDetail: FinalExamAttemptDetail): Promise<FinalExamAttemptDetail> {
    return this.finalExamAttemptDetailRepository
      .findOne({ id: finalExamAttemptDetail.id })
      // .exec()
      .then(async dbFinalExamAttemptDetail => {
        // We check if a finalExamAttemptDetail already exists.
        // If it does don't create a new one.
        if (dbFinalExamAttemptDetail) {
          return Promise.reject({message: 'FinalExamAttemptDetail is already exist.'});
        }
        return Promise.resolve(
          await this.finalExamAttemptDetailRepository.save(finalExamAttemptDetail),
        );
      })
      .catch(error => Promise.reject(error));
  }
  /**
   * Seed all finalExamAttemptDetails.
   *
   * @function
   */
  async createMultiple(finalExamAttemptDetails: FinalExamAttemptDetail[]): Promise<FinalExamAttemptDetail[]> {
    try {
      const listResult = [];
      for (const finalExamAttemptDetail of finalExamAttemptDetails) {
        const dbFinalExamAttemptDetail = await this.finalExamAttemptDetailRepository.findOne({ id: finalExamAttemptDetail.id });

        if (dbFinalExamAttemptDetail) {
          return Promise.reject({message: 'FinalExamAttemptDetail is already exist.'});
        }
        const result = await this.finalExamAttemptDetailRepository.save(finalExamAttemptDetail);
        listResult.push(result);
      }

      return Promise.resolve(listResult);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Update a finalExamAttemptDetail
   *
   * @function
   */
  async update(id: string, newData: any): Promise<FinalExamAttemptDetail> {
    const oldData = await this.finalExamAttemptDetailRepository.findOne({ id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'FinalExamAttemptDetail is not exist'});
    }

    const updated: FinalExamAttemptDetail = Object.assign(oldData, newData);
    return this.finalExamAttemptDetailRepository.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

  /**
   * Delete a finalExamAttemptDetail
   *
   * @function
   */
  async forceDelete(id: string): Promise<FinalExamAttemptDetail | DeleteResult> {
    const oldData = await this.finalExamAttemptDetailRepository.findOne({ id });
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'FinalExamAttemptDetail is not exist'});
    }

    return this.finalExamAttemptDetailRepository.delete({id})
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }
  /**
   * Delete a finalExamAttemptDetail
   *
   * @function
   */
  async forceDeleteMultiple(ids: string[]): Promise<FinalExamAttemptDetail | DeleteResult> {
    return this.finalExamAttemptDetailRepository.delete(ids)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }
}
