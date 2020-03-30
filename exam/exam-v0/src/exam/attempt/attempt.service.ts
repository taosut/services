import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import _ from 'lodash';
import { In, Repository } from 'typeorm';
import { ExamService } from '../exam.service';
import { QuestionDto } from '../question/question.dto';
import { QuestionService } from '../question/question.service';
import { QuestionType } from '../question/questionType.enum';
import { AttemptDto } from './attempt.dto';
import { Attempt } from './attempt.entity';
import {
  AnswerObjectSubmitDto,
  AttemptDetailDto,
} from './attemptDetail/attemptDetail.dto';
import { AttemptDetail } from './attemptDetail/attemptDetail.entity';
import { AttemptDetailService } from './attemptDetail/attemptDetail.service';

@Injectable()
export class AttemptService extends TypeOrmCrudService<Attempt> {
  constructor(
    @InjectRepository(Attempt) repo: Repository<Attempt>,
    private readonly examService: ExamService,
    private readonly questionService: QuestionService,
    private readonly attemptDetailService: AttemptDetailService
  ) {
    super(repo);
  }

  async start(examId: string, userId: string): Promise<any> {
    try {
      const exam = await this.examService.findOne({ id: examId });
      const isAttemptExist: AttemptDto = await this.repo.findOne({
        exam_id: examId,
        user_id: userId,
      });
      const questions: QuestionDto[] = await this.questionService.find({
        where: { exam_id: examId },
      });
      const randomQuestions: QuestionDto[] = _.shuffle(questions);
      let attempt;
      if (randomQuestions.length === 0) {
        return Promise.reject({
          statusCode: 500,
          message: 'There is no question',
        });
      }
      if (isAttemptExist) {
        // re attempt
        let updateAttempt;
        if (isAttemptExist.finished) {
          updateAttempt = {
            total_attempted: isAttemptExist.total_attempted + 1,
            finished: false,
            latest_started_at: new Date(),
            total_correct: 0,
            total_question: 0,
          };
          await this.repo.update(isAttemptExist.id, updateAttempt);
          attempt = {
            ...isAttemptExist,
            ...updateAttempt,
          };
          const attemptDetails = await this.attemptDetailService.find({
            where: { attempt_id: isAttemptExist.id },
          });
          for (const willDelete of attemptDetails) {
            await this.attemptDetailService.delete(willDelete.id);
          }

          let sortOrder = 1;
          for (const question of randomQuestions) {
            if (true) {
              const attemptDetailBody: AttemptDetailDto = {
                question: question.question,
                question_id: question.id,
                sort_order: sortOrder,
                attempt_id: isAttemptExist.id,
              };
              await this.attemptDetailService.create(attemptDetailBody);
            }
            sortOrder++;
          }
        } else {
          attempt = isAttemptExist;
          // calculate duration
          const latestStartAt = attempt.latest_started_at;
          const latestStartAtTime = latestStartAt.getTime();
          const now = new Date();
          const nowTime = now.getTime();
          const diffSecond = (nowTime - latestStartAtTime) / 1000;

          if (exam.duration > 0 && diffSecond > exam.duration) {
            // calculate score and submit
            await this.finish(examId, userId);

            // throw error
            return Promise.reject({ statusCode: 400, message: 'TIME\'S UP' });
          }
        }
      } else {
        // create attempt
        const attemptBody: AttemptDto = {
          total_attempted: 1,
          total_correct: 0,
          total_question: randomQuestions.length,
          latest_started_at: new Date(),
          latest_score: null,
          elapsed_time: 0,
          finished: false,
          exam_id: examId,
          user_id: userId,
        };
        const createdAttempt = await this.repo.create(attemptBody);
        attempt = await this.repo.save(createdAttempt);

        let sortOrder = 1;
        for (const question of randomQuestions) {
          if (true) {
            const attemptDetailBody: AttemptDetailDto = {
              question: question.question,
              question_id: question.id,
              sort_order: sortOrder,
              attempt_id: attempt.id,
            };
            await this.attemptDetailService.create(attemptDetailBody);
          }
          sortOrder++;
        }
      }

      if (!attempt) {
        attempt = {
          ...isAttemptExist,
        };
      }
      const resAttemptDetail: AttemptDetail[] = await this.attemptDetailService.find({
        where: { attempt_id: attempt.id },
      });
      const questionIds = resAttemptDetail.map(item => item.question_id);
      const resQuestions = await this.questionService.find({
        where: {
          id: In(questionIds),
        },
        relations: ['answers'],
      });
      const resAttemptDetailAnswers = resAttemptDetail.map(itemAttemptDetail => {
        const findAnswers = resQuestions.find(itemQuestion => itemQuestion.id === itemAttemptDetail.question_id);
        return {
            ...itemAttemptDetail,
          answers: findAnswers ? _.shuffle(findAnswers.answers) : [],
        };
      });
      attempt = {
        ...attempt,
        attempt_details: resAttemptDetailAnswers,
      };
      return attempt;
    } catch (error) {
      Promise.reject(error);
    }
  }

  async submit(
    examId: string,
    choosenAnswer: AnswerObjectSubmitDto,
    userId: string
  ): Promise<AttemptDetailDto> {
    try {
      const exam = await this.examService.findOne({ id: examId });
      if (!exam) {
        return Promise.reject({ statusCode: 404, message: 'Exam not found.' });
      }
      const attempt = await this.findOne({ exam_id: examId, user_id: userId });
      if (attempt.finished) {
        return Promise.reject({
          statusCode: 400,
          message: 'Attempt has been finished',
        });
      }
      let attemptDetail: Partial<
        AttemptDetail
      > = await this.attemptDetailService.findOne({
        where: {
          attempt_id: attempt.id,
          question_id: choosenAnswer.question_id,
        },
      });
      if (choosenAnswer.choosen_answer_ids) {
        attemptDetail = {
          ...attemptDetail,
          choosen_answer_ids: choosenAnswer.choosen_answer_ids,
        };
      }
      await this.attemptDetailService.update(attemptDetail.id, attemptDetail);
      const result = await this.attemptDetailService.findOne({
        id: attemptDetail.id,
      });
      return result;
    } catch (error) {
      Promise.reject(error);
    }
  }

  async finish(examId: string, userId: string): Promise<Partial<Attempt>> {
    try {
      const exam = await this.examService.findOne({ id: examId });
      if (!exam) {
        return Promise.reject({ statusCode: 404, message: 'Exam not found' });
      }
      let attempt: Partial<Attempt> = await this.repo.findOne({
        exam_id: examId,
        user_id: userId,
      });

      const attemptDetails: Array<
        Partial<AttemptDetail>
      > = await this.attemptDetailService.find({
        where: { attempt_id: attempt.id },
      });
      const questions = await this.questionService.find({
        where: { exam_id: examId },
        relations: ['answers'],
      });

      let totalCorrect = 0;
      const defaultScorePerQuestion = 10;
      let score = 0;
      let point = 0; // scoring
      let totalCorrectByScoring = 0;
      let maxScore = 0; // scoring
      const totalQuestion = attemptDetails.length;
      for (let attemptDetail of attemptDetails) {
        for (const question of questions) {
          if (question.id === attemptDetail.question_id) {
            // get all correct answers from database
            let correctAnswers: any[];
            let correctAnswersIds: string[];
            if (question.type === 'SCORING') {
              correctAnswers = await question.answers.filter(item =>
                Number(item.score)
              );
              correctAnswersIds = await correctAnswers.map(item => item.id);
            } else {
              correctAnswers = await question.answers.filter(
                item => item.correct
              );
              correctAnswersIds = await correctAnswers.map(item => item.id);
            }

            if (correctAnswers.length > 0) {
              attemptDetail = {
                ...attemptDetail,
                correct_answer_ids: correctAnswersIds,
              };
              await this.attemptDetailService.update(
                attemptDetail.id,
                attemptDetail
              );
              if (
                !question.type ||
                question.type === QuestionType.MULTIPLE_CHOICE
              ) {
                // MULTIPLE_CHOICE
                maxScore += defaultScorePerQuestion;
                let isCorrect = false;
                if (
                  attemptDetail.choosen_answer_ids &&
                  attemptDetail.choosen_answer_ids.length > 0
                ) {
                  for (const answerId of correctAnswersIds) {
                    // check, is correct answerId exist in choosen_answer_ids
                    const find = await attemptDetail.choosen_answer_ids.find(
                      item => item === answerId
                    );
                    if (find) {
                      isCorrect = true;
                    }
                  }
                }
                if (isCorrect) {
                  totalCorrect++;
                }
              } else if (
                question.type === QuestionType.MULTIPLE_SELECTION_ANSWER
              ) {
                // MULTIPLE_SELECTION_ANSWER
                maxScore += defaultScorePerQuestion;
                let isCorrect = true;
                if (
                  attemptDetail.choosen_answer_ids &&
                  attemptDetail.choosen_answer_ids.length > 0
                ) {
                  let isChoosenCorrect = true;
                  for (const answerId of correctAnswersIds) {
                    const find = await attemptDetail.choosen_answer_ids.find(
                      item => item === answerId
                    );
                    if (!find) {
                      isChoosenCorrect = false;
                    }
                  }
                  let isRealCorrect = true;
                  for (const choosenAnswerId of attemptDetail.choosen_answer_ids) {
                    const find = await correctAnswersIds.find(
                      item => item === choosenAnswerId
                    );
                    if (!find) {
                      isRealCorrect = false;
                    }
                  }
                  if (isChoosenCorrect && isRealCorrect) {
                    isCorrect = true;
                  } else {
                    isCorrect = false;
                  }
                }
                if (isCorrect) {
                  totalCorrect++;
                }
              } else if (question.type === QuestionType.SCORING) {
                // SCORING
                for (const value of correctAnswers) {
                  maxScore += Number(value.score);
                }
                let currentPoint = 0;
                for (const choosenAnswerId of attemptDetail.choosen_answer_ids) {
                  const findAnswer = await correctAnswers.find(
                    answerItem => answerItem.id === choosenAnswerId
                  );
                  if (findAnswer) {
                    currentPoint += Number(findAnswer.score);
                  }
                }
                if (currentPoint > 0) {
                  point += currentPoint;
                  totalCorrectByScoring++;
                }
              }
            } else {
              // bonus because there is no answer
              totalCorrect++;
              maxScore += defaultScorePerQuestion;
            }
          }
        }
      }
      score =
        ((totalCorrect * defaultScorePerQuestion + point) / maxScore) * 100;
      attempt = {
        ...attempt,
        total_correct: totalCorrect + totalCorrectByScoring,
        total_question: totalQuestion,
        latest_score: String(score),
        finished: true,
      };
      await this.repo.update(attempt.id, attempt);
      return await this.repo.findOne({ id: attempt.id });
    } catch (error) {
      Promise.reject(error);
    }
  }
}
