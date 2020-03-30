import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FinalExam } from '../../../models/final_exam/final_exam.entity';
import { Repository } from 'typeorm';
import { IFinalExam } from '../../../models/final_exam/final_exam.interface';
import { data } from './data';
/**
 * Service dealing with final_exam based operations.
 *
 * @class
 */
@Injectable()
export class FinalExamSeederService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {Repository<FinalExam>} finalExamRepository
   */
  constructor(
    @InjectRepository(FinalExam)
    private readonly finalExamRepository: Repository<FinalExam>,
  ) {}
  /**
   * Seed all finalExams.
   *
   * @function
   */
  create(): Array<Promise<FinalExam>> {
    return data.map(async (finalExam: IFinalExam) => {
      return await this.finalExamRepository
        .findOne({ id: finalExam.id })
        // .exec()
        .then(async dbFinalExam => {
          // We check if a finalExam already exists.
          // If it does don't create a new one.
          if (dbFinalExam) {
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
