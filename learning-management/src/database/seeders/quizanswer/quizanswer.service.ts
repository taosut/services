import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizAnswer } from '../../../models/quizanswer/quizanswer.entity';
import { Repository } from 'typeorm';
import { IQuizAnswer } from '../../../models/quizanswer/quizanswer.interface';
import { data } from './data';
/**
 * Service dealing with quizanswer based operations.
 *
 * @class
 */
@Injectable()
export class QuizAnswerSeederService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {Repository<QuizAnswer>} quizAnswerRepository
   */
  constructor(
    @InjectRepository(QuizAnswer)
    private readonly quizAnswerRepository: Repository<QuizAnswer>,
  ) {}
  /**
   * Seed all quizAnswers.
   *
   * @function
   */
  create(): Array<Promise<QuizAnswer>> {
    return data.map(async (quizAnswer: IQuizAnswer) => {
      return await this.quizAnswerRepository
        .findOne({ id: quizAnswer.id })
        // .exec()
        .then(async dbQuizAnswer => {
          // We check if a quizAnswer already exists.
          // If it does don't create a new one.
          if (dbQuizAnswer) {
            return Promise.resolve(null);
          }
          return Promise.resolve(
            await this.quizAnswerRepository.save(quizAnswer),
          );
        })
        .catch(error => Promise.reject(error));
    });
  }
}
