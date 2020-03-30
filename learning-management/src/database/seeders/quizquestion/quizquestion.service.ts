import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizQuestion } from '../../../models/quizquestion/quizquestion.entity';
import { Repository } from 'typeorm';
import { IQuizQuestion } from '../../../models/quizquestion/quizquestion.interface';
import { data } from './data';
/**
 * Service dealing with quizquestion based operations.
 *
 * @class
 */
@Injectable()
export class QuizQuestionSeederService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {Repository<QuizQuestion>} finalExamRepository
   */
  constructor(
    @InjectRepository(QuizQuestion)
    private readonly finalExamRepository: Repository<QuizQuestion>,
  ) {}
  /**
   * Seed all finalExams.
   *
   * @function
   */
  create(): Array<Promise<QuizQuestion>> {
    return data.map(async (finalExam: IQuizQuestion) => {
      return await this.finalExamRepository
        .findOne({ id: finalExam.id })
        // .exec()
        .then(async dbQuizQuestion => {
          // We check if a finalExam already exists.
          // If it does don't create a new one.
          if (dbQuizQuestion) {
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
