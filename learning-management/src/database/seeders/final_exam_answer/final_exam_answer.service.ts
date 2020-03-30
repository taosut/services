import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FinalExamAnswer } from '../../../models/final_exam_answer/final_exam_answer.entity';
import { Repository } from 'typeorm';
import { IFinalExamAnswer } from '../../../models/final_exam_answer/final_exam_answer.interface';
import { data } from './data';
/**
 * Service dealing with final_exam_answer based operations.
 *
 * @class
 */
@Injectable()
export class FinalExamAnswerSeederService {
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
   * Seed all finalExamAnswers.
   *
   * @function
   */
  create(): Array<Promise<FinalExamAnswer>> {
    return data.map(async (finalExamAnswer: IFinalExamAnswer) => {
      return await this.finalExamAnswerRepository
        .findOne({ id: finalExamAnswer.id })
        // .exec()
        .then(async dbFinalExamAnswer => {
          // We check if a finalExamAnswer already exists.
          // If it does don't create a new one.
          if (dbFinalExamAnswer) {
            return Promise.resolve(null);
          }
          return Promise.resolve(
            await this.finalExamAnswerRepository.save(finalExamAnswer),
          );
        })
        .catch(error => Promise.reject(error));
    });
  }
}
