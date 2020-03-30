import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FinalExamAttemptDetail } from '../../../models/final_exam_attempt_detail/final_exam_attempt_detail.entity';
import { Repository } from 'typeorm';
import { IFinalExamAttemptDetail } from '../../../models/final_exam_attempt_detail/final_exam_attempt_detail.interface';
import { data } from './data';
/**
 * Service dealing with final_exam_attempt_detail based operations.
 *
 * @class
 */
@Injectable()
export class FinalExamAttemptDetailSeederService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {Repository<FinalExamAttemptDetail>} finalExamRepository
   */
  constructor(
    @InjectRepository(FinalExamAttemptDetail)
    private readonly finalExamRepository: Repository<FinalExamAttemptDetail>,
  ) {}
  /**
   * Seed all finalExams.
   *
   * @function
   */
  create(): Array<Promise<FinalExamAttemptDetail>> {
    return data.map(async (finalExam: IFinalExamAttemptDetail) => {
      return await this.finalExamRepository
        .findOne({ id: finalExam.id })
        // .exec()
        .then(async dbFinalExamAttemptDetail => {
          // We check if a finalExam already exists.
          // If it does don't create a new one.
          if (dbFinalExamAttemptDetail) {
            return Promise.resolve(null);
          }
          return Promise.resolve(
            await this.finalExamRepository.save(finalExam),
          );
        })
        .catch(error => Promise.reject(error));
    });
  }
}
