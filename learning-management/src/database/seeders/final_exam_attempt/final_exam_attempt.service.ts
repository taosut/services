import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FinalExamAttempt } from '../../../models/final_exam_attempt/final_exam_attempt.entity';
import { Repository } from 'typeorm';
import { IFinalExamAttempt } from '../../../models/final_exam_attempt/final_exam_attempt.interface';
import { data } from './data';
/**
 * Service dealing with final_exam_attempt based operations.
 *
 * @class
 */
@Injectable()
export class FinalExamAttemptSeederService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {Repository<FinalExamAttempt>} finalExamRepository
   */
  constructor(
    @InjectRepository(FinalExamAttempt)
    private readonly finalExamRepository: Repository<FinalExamAttempt>,
  ) {}
  /**
   * Seed all finalExams.
   *
   * @function
   */
  create(): Array<Promise<FinalExamAttempt>> {
    return data.map(async (finalExam: IFinalExamAttempt) => {
      return await this.finalExamRepository
        .findOne({ id: finalExam.id })
        // .exec()
        .then(async dbFinalExamAttempt => {
          // We check if a finalExam already exists.
          // If it does don't create a new one.
          if (dbFinalExamAttempt) {
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
