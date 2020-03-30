import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FinalExamQuestion } from '../../../models/final_exam_question/final_exam_question.entity';
import { Repository } from 'typeorm';
import { IFinalExamQuestion } from '../../../models/final_exam_question/final_exam_question.interface';
import { data } from './data';
/**
 * Service dealing with final_exam_question based operations.
 *
 * @class
 */
@Injectable()
export class FinalExamQuestionSeederService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {Repository<FinalExamQuestion>} finalExamRepository
   */
  constructor(
    @InjectRepository(FinalExamQuestion)
    private readonly finalExamRepository: Repository<FinalExamQuestion>,
  ) {}
  /**
   * Seed all finalExams.
   *
   * @function
   */
  create(): Array<Promise<FinalExamQuestion>> {
    return data.map(async (finalExam: IFinalExamQuestion) => {
      return await this.finalExamRepository
        .findOne({ id: finalExam.id })
        // .exec()
        .then(async dbFinalExamQuestion => {
          // We check if a finalExam already exists.
          // If it does don't create a new one.
          if (dbFinalExamQuestion) {
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
