import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import _ from 'lodash';
import { Repository } from 'typeorm';
import { AccountInvokeService } from '../../services/account.service';
import { CertificateInvokeService } from '../../services/certificate.service';
import { ClassInvokeService } from '../../services/class.service';
import { ExamInvokeService } from '../../services/exam.service';
import { ExamQuestionInvokeService } from '../../services/examQuestion.service';
import { MembershipInvokeService } from '../../services/membership.service';
import {
  AnswerObjectSubmitDto,
  QueryGetAttemptDto,
} from '../attempt/attempt.dto';
import { EQuestionType } from '../questionType.enum';
import { NextCompletionResponseDto } from './completion.dto';
import { Completion } from './completion.entity';
import { GenerateCompletionDto } from './types/completion.dto';
import { MetaAttemptDto, MetaCompletionDto } from './types/meta.dto';
import { EUnitType } from './types/unitType.enum';

@Injectable()
export class CompletionService extends TypeOrmCrudService<Completion> {
  constructor(
    @InjectRepository(Completion)
    protected readonly repository: Repository<Completion>,
    protected readonly classInvokeService: ClassInvokeService,
    protected readonly membershipInvokeService: MembershipInvokeService,
    protected readonly accountInvokeService: AccountInvokeService,
    protected readonly certificateInvokeService: CertificateInvokeService,
    private readonly questionInvokeService: ExamQuestionInvokeService,
    private readonly examInvokeService: ExamInvokeService
  ) {
    super(repository);
  }

  async generateInitialCompletion(
    dto: GenerateCompletionDto,
    headers: any
  ): Promise<any> {
    try {
      const results: any[] = [];
      // invoke class service
      const classDetail: any = await this.classInvokeService.findOne(
        dto.class_id,
        headers
      );
      const classId: string = classDetail.id;
      // generate initial completion
      for (const track of classDetail.tracks) {
        for (const unit of track.units) {
          const data: Partial<Completion> = {
            type: unit.type,
            class_id: classId,
            track_id: track.id,
            unit_id: unit.id,
            user_id: dto.user_id,
            progress: '0',
            elapsed_time: 0,
            finished: false,
          };
          const isExist: Completion = await this.repository.findOne({
            where: {
              class_id: classId,
              track_id: track.id,
              unit_id: unit.id,
              user_id: dto.user_id,
            },
          });
          if (isExist) {
            await this.repository.delete(isExist.id);
          }
          const created: Completion = await this.repository.create(data);
          const saved: Completion = await this.repository.save(created);
          results.push(saved);
        }
      }
      return results;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async updateCompletion(
    dto: Partial<Completion>,
    userId: string,
    headers: any
  ): Promise<Completion> {
    try {
      // invoke membership, is exist in membership
      // const queryMembership =
      //   'filter=user_id||eq||USER_ID&filter[]=class_id||eq||CLASS_ID';
      // const memberships = await this.membershipInvokeService.find(
      //   queryMembership
      // );

      // if (memberships && Array.isArray(memberships) && memberships.length > 0) {
        await this.repository.update(
          {
            user_id: userId,
            class_id: dto.class_id,
            track_id: dto.track_id,
            unit_id: dto.unit_id,
          },
          dto
        );
        // is class finished ?
        const classCompletion = await this.getCompletionByClassId(
          dto.class_id,
          userId,
          headers
        );
        if (classCompletion && classCompletion.finished) {
          const userData = await this.accountInvokeService.findOne(
            userId,
            headers
          );
          const classData = await this.classInvokeService.findOne(
            dto.class_id,
            headers
          );
          const certificateData = {
            user: userData,
            class: classData,
            completion: classCompletion,
          };
          this.certificateInvokeService.create(certificateData, headers);
        }
        // end check
        return await this.repository.findOne({
          where: {
            user_id: userId,
            class_id: dto.class_id,
            track_id: dto.track_id,
            unit_id: dto.unit_id,
          },
        });
      // } else {
      //   return Promise.reject({ status: 401, message: 'Membership not found' });
      // }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getCompletionByUnitId(unitId: string, userId: string): Promise<any> {
    try {
      return await this.repository.findOne({
        where: { user_id: userId, unit_id: unitId },
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getCompletionByTrackId(trackId: string, userId: string): Promise<any> {
    try {
      let progress = 0;
      let lectureProgress = 0;
      let quizProgress = 0;
      const quizScore = 0;
      let totalLecture = 0;
      let totalQuiz = 0;
      const completions = await this.repository.find({
        where: { user_id: userId, track_id: trackId },
      });
      completions.sort((a, b) => {
        const dateB = new Date(b.updated_at).getTime();
        const dateA = new Date(a.updated_at).getTime();
        return dateB - dateA;
      });
      for (const data of completions) {
        progress += Number(data.progress);
        if (data.type.toUpperCase() === EUnitType.EXAM) {
          // get data score from attempt
          quizProgress += Number(data.progress);
          totalQuiz++;
        } else {
          lectureProgress += Number(data.progress);
          totalLecture++;
        }
      }

      progress =
        totalLecture + totalQuiz > 0
          ? progress / (totalLecture + totalQuiz)
          : progress;
      lectureProgress =
        totalLecture > 0 ? lectureProgress / totalLecture : lectureProgress;
      quizProgress = totalQuiz > 0 ? quizProgress / totalQuiz : quizProgress;

      return {
        track_id: trackId,
        user_id: userId,
        progress,
        lecture_progress: lectureProgress,
        quiz_progress: quizProgress,
        quiz_score: quizScore,
        finished: progress >= 100 ? true : false,
        completed_at:
          completions && completions.length > 0
            ? completions[0].updated_at
            : null,
        total_lecture: totalLecture,
        total_quiz: totalQuiz,
        unit_completions: completions,
      };
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getCompletionByClassId(classId: string, userId: string, headers: any): Promise<any> {
    try {
      let progress = 0;
      let lectureProgress = 0;
      let quizProgress = 0;
      let quizScore = 0;
      let totalLecture = 0;
      let totalQuiz = 0;
      const unitCompletionByClass = await this.repository.find({
        where: { user_id: userId, class_id: classId },
      });

      const trackIds = [];
      for (const item of unitCompletionByClass) {
        const isExist = trackIds.find(el => el === item.track_id);
        if (!isExist) {
          trackIds.push(item.track_id);
        }
      }

      const trackCompletions: any[] = [];
      for (const trackId of trackIds) {
        const trackCompletion = await this.getCompletionByTrackId(
          trackId,
          userId
        );
        trackCompletions.push(trackCompletion);
      }

      trackCompletions.sort((a, b) => {
        const dateB = new Date(b.completed_at).getTime();
        const dateA = new Date(a.completed_at).getTime();
        return dateB - dateA;
      });
      for (const data of trackCompletions) {
        progress += Number(data.progress);
        if (data.total_quiz > 0) {
          // get data from attempt
          quizProgress += Number(data.quiz_progress);
          totalQuiz++;
          quizScore += Number(data.quiz_score);
        }
        if (data.total_lecture > 0) {
          lectureProgress += Number(data.lecture_progress);
          totalLecture++;
        }
      }
      const totalTrack = totalLecture > totalQuiz ? totalLecture : totalQuiz;

      progress =
        totalTrack > 0
          ? progress / (totalTrack)
          : progress;
      lectureProgress =
        totalLecture > 0 ? lectureProgress / totalLecture : lectureProgress;
      quizProgress = totalQuiz > 0 ? quizProgress / totalQuiz : quizProgress;

      quizScore = totalQuiz > 0 ? quizScore / totalQuiz : quizScore;

      const result = {
        class_id: classId,
        user_id: userId,
        progress,
        lecture_progress: lectureProgress,
        quiz_progress: quizProgress,
        quiz_score: quizScore,
        finished: progress >= 100 ? true : false,
        completed_at:
          trackCompletions && trackCompletions.length > 0
            ? trackCompletions[0].updated_at
            : null,
        total_track_contain_lecture: totalLecture,
        total_track_contain_quiz: totalQuiz,
        track_completions: trackCompletions,
      };

      this.generateCertificateData(result, headers);

      return result;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async nextCompletion(
    query: { class_id: string; user_id: string },
    headers: any
  ): Promise<NextCompletionResponseDto> {
    try {
      // get class service
      const classDetail = await this.classInvokeService.findOne(
        query.class_id,
        headers
      );
      if (!classDetail) {
        return Promise.reject('Class is not found');
      }
      // get list completion
      const classCompletions = await this.repo.find({ where: query });
      if (classCompletions.length === 0) {
        return Promise.reject({statusCode: 404, message: 'There is no completion.'});
      }
      let nextUnit: NextCompletionResponseDto = {
        track: null,
        next_unit: null,
      };
      for (const track of classDetail.tracks) {
        for (const unit of track.units) {
          const findUnFinished = classCompletions.find(
            item =>
              item.class_id === classDetail.id &&
              item.track_id === track.id &&
              item.unit_id === unit.id &&
              !item.finished
          );
          if (findUnFinished && !nextUnit.next_unit) {
            nextUnit = {
              track,
              next_unit: unit,
            };
          }
        }
      }
      if (!nextUnit.next_unit) {
        nextUnit = {
          ...nextUnit,
          track: classDetail.tracks[0],
          next_unit: classDetail.tracks[0].units[0],
        };
      }
      return Promise.resolve(nextUnit);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  // ATTEMPT
  async getAttempts(query: QueryGetAttemptDto): Promise<MetaAttemptDto[]> {
    try {
      let unitCompletion: Partial<Completion> = await this.repository.findOne({
        where: {
          class_id: query.class_id,
          track_id: query.track_id,
          unit_id: query.unit_id,
          user_id: query.user_id,
        },
      });
      if (!unitCompletion) {
        return Promise.reject({
          statusCode: 404,
          message: 'Completion is not found',
        });
      } else if (
        unitCompletion &&
        ((unitCompletion.meta &&
          unitCompletion.meta.attempts &&
          unitCompletion.meta.attempts.length === 0) ||
          !unitCompletion.meta)
      ) {
        const tempData: MetaCompletionDto = {
          attempts: [],
        };
        unitCompletion = { ...unitCompletion, meta: tempData };
        await this.repository.update(unitCompletion.id, unitCompletion);
      }
      const attempts = unitCompletion.meta.attempts;
      attempts.sort((a, b) => { // DESC
        const dateB = new Date(b.created_at).getTime();
        const dateA = new Date(a.created_at).getTime();
        return dateB - dateA;
      });
      return attempts;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getLatestAttempt(query: QueryGetAttemptDto): Promise<any> {
    try {
      const attempts = await this.getAttempts(query);
      if (attempts && attempts.length > 0) {
        const latestFinished: any = await this.getLatestFinishedAttempt(query);
        return {
          ...attempts[0],
          latest_finished: latestFinished,
        };
      } else {
        return null;
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getLatestFinishedAttempt(query: QueryGetAttemptDto): Promise<MetaAttemptDto> {
    try {
      const attempts = await this.getAttempts(query);
      if (attempts && attempts.length > 0) {
        attempts.sort((a, b) => { // DESC
          const dateB = new Date(b.created_at).getTime();
          const dateA = new Date(a.created_at).getTime();
          return dateB - dateA;
        });
        const attempt = await attempts.find((item: any) => item.finished);
        return attempt;
      } else {
        return null;
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async updateLatestAttempt(
    query: QueryGetAttemptDto,
    dto: MetaAttemptDto
  ): Promise<MetaAttemptDto> {
    try {
      // get unit completion
      let unitCompletion: Partial<Completion> = await this.repository.findOne({
        where: {
          class_id: query.class_id,
          track_id: query.track_id,
          unit_id: query.unit_id,
          user_id: query.user_id,
        },
      });
      if (!unitCompletion) {
        return Promise.reject({
          statusCode: 404,
          message: 'Completion is not found',
        });
      } else if (unitCompletion && !unitCompletion.meta) {
        const tempData: MetaCompletionDto = {
          attempts: [],
        };
        unitCompletion = { ...unitCompletion, meta: tempData };
        await this.repository.update(unitCompletion.id, unitCompletion);
        return Promise.reject({
          statusCode: 404,
          message: 'Attempt not found',
        });
      }
      if (unitCompletion.meta && unitCompletion.meta.attempts.length === 0) {
        return Promise.reject({
          statusCode: 404,
          message: 'Attempt not found',
        });
      }
      unitCompletion.meta.attempts.sort((a, b) => {
        // ascending
        const dateB = new Date(b.created_at).getTime();
        const dateA = new Date(a.created_at).getTime();
        return dateA - dateB;
      });
      // update
      unitCompletion.meta.attempts = unitCompletion.meta.attempts.map(
        (item, index) => {
          if (index === unitCompletion.meta.attempts.length - 1) {
            item = {
              ...item,
              ...dto,
              updated_at: new Date(),
            };
          }
          return item;
        }
      );
      await this.repository.update(unitCompletion.id, unitCompletion);
      return unitCompletion.meta.attempts[
        unitCompletion.meta.attempts.length - 1
      ];
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async createNewAttempt(
    query: QueryGetAttemptDto,
    dto: MetaAttemptDto
  ): Promise<MetaAttemptDto> {
    try {
      // get unit completion
      let unitCompletion: Partial<Completion> = await this.repository.findOne({
        where: {
          class_id: query.class_id,
          track_id: query.track_id,
          unit_id: query.unit_id,
          user_id: query.user_id,
        },
      });
      if (!unitCompletion) {
        return Promise.reject({
          statusCode: 404,
          message: 'Completion is not found',
        });
      } else if (unitCompletion && (!unitCompletion.meta || (unitCompletion.meta && !unitCompletion.meta.attempts))) {
        const tempData: MetaCompletionDto = {
          attempts: [],
        };
        unitCompletion = { ...unitCompletion, meta: tempData };
        await this.repository.update(unitCompletion.id, unitCompletion);
      }
      const tempData1 = {
        ...dto,
        created_at: new Date(),
        updated_at: new Date(),
      };
      await unitCompletion.meta.attempts.push(tempData1);
      await this.repository.update(unitCompletion.id, unitCompletion);
      return tempData1;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async start(query: QueryGetAttemptDto, headers: any): Promise<any> {
    try {
      const exams = await this.examInvokeService.findByQuery(
        {
          class_id: query.class_id,
          track_id: query.track_id,
          unit_id: query.unit_id,
        },
        headers
      );
      let exam;
      if (exams.length > 0) {
        exam = exams[0];
      } else {
        return Promise.reject({
          statusCode: 404,
          message: 'Exam is not found',
        });
      }

      // generate random question and answer
      const questions: any[] = await this.questionInvokeService.find({
        filter: `exam_id||eq||${exam.id}`,
        join: 'answers',
      });
      let randomQuestions: any[] = _.shuffle(questions);
      randomQuestions = randomQuestions.map(item => {
        return {
          ...item,
          answers: _.shuffle(item.answers),
        };
      });

      const isAttemptExist: MetaAttemptDto = await this.getLatestAttempt(query);
      let attempt: MetaAttemptDto;
      if (randomQuestions.length === 0) {
        return Promise.reject({
          statusCode: 500,
          message: 'There is no question',
        });
      }
      if (isAttemptExist) {
        // re attempt
        if (isAttemptExist.finished) {
          attempt = {
            exam_id: exam.id,
            finished: false,
            score: null,
            attempt_details: [],
          };
          attempt.attempt_details = randomQuestions.map((item, index) => {
            return {
              question: item,
              sort_order: index + 1,
              choosen_answer_ids: [],
              correct_answer_ids: [],
            };
          });
          await this.createNewAttempt(query, attempt);
        } else {
          attempt = isAttemptExist;
          // calculate duration
          const latestStartAt = new Date(attempt.created_at);
          const latestStartAtTime = latestStartAt.getTime();
          const now = new Date();
          const nowTime = now.getTime();
          const diffSecond = (nowTime - latestStartAtTime) / 1000;

          if (exam.duration > 0 && diffSecond > exam.duration) {
            // calculate score and submit
            await this.finish(query, headers);

            // throw error
            return Promise.reject({ statusCode: 400, message: 'TIME\'S UP' });
          }
        }
      } else {
        // create attempt
        const attemptBody: MetaAttemptDto = {
          finished: false,
          exam_id: exam.id,
          score: null,
          attempt_details: randomQuestions,
        };
        attemptBody.attempt_details = attemptBody.attempt_details.map(
          (item, index) => {
            return {
              question: item,
              sort_order: index + 1,
              choosen_answer_ids: [],
              correct_answer_ids: [],
            };
          }
        );
        await this.createNewAttempt(query, attemptBody);
      }

      return await this.getLatestAttempt(query);
    } catch (error) {
      Promise.reject(error);
    }
  }

  async submit(
    query: QueryGetAttemptDto,
    choosenAnswer: AnswerObjectSubmitDto,
    isReturnCorrectAnswer: boolean = false
  ): Promise<any> {
    try {
      const attempt = await this.getLatestAttempt(query);
      if (!attempt) {
        return Promise.reject({
          statusCode: 404,
          message: 'Attempt is not found',
        });
      }
      attempt.attempt_details = attempt.attempt_details.map(item => {
        if (choosenAnswer.question_id === item.question.id) {
          item = {
            ...item,
            choosen_answer_ids: choosenAnswer.choosen_answer_ids,
          };
        }
        return item;
      });
      if (isReturnCorrectAnswer) {
        //
      }
      await this.updateLatestAttempt(query, attempt);
      return attempt;
    } catch (error) {
      Promise.reject(error);
    }
  }

  async finish(
    query: QueryGetAttemptDto,
    headers: any
  ): Promise<MetaAttemptDto> {
    try {
      const completion: Completion = await this.repository.findOne({
        where: {
          class_id: query.class_id,
          track_id: query.track_id,
          unit_id: query.unit_id,
          user_id: query.user_id,
        },
      });
      let attempt: MetaAttemptDto = await this.getLatestAttempt(query);
      if (!attempt) {
        return Promise.reject({
          statusCode: 404,
          message: 'Attempt is not found',
        });
      }

      let totalCorrect = 0;
      const defaultScorePerQuestion = 10;
      let score = 0;
      let point = 0; // scoring
      let totalCorrectByScoring = 0;
      let maxScore = 0; // scoring
      const totalQuestion = attempt.attempt_details.length;
      let index = 0;
      for (let attemptDetail of attempt.attempt_details) {
        // get all correct answers from database
        let correctAnswers: any[];
        let correctAnswersIds: string[];
        if (attemptDetail.question.type === 'SCORING') {
          correctAnswers = await attemptDetail.question.answers.filter(item =>
            Number(item.score)
          );
          correctAnswersIds = await correctAnswers.map(item => item.id);
        } else {
          correctAnswers = await attemptDetail.question.answers.filter(
            item => item.correct
          );
          correctAnswersIds = await correctAnswers.map(item => item.id);
        }

        if (correctAnswers.length > 0) {
          attemptDetail = {
            ...attemptDetail,
            correct_answer_ids: correctAnswersIds,
          };
          attempt.attempt_details[index] = attemptDetail;
          if (
            !attemptDetail.question.type ||
            attemptDetail.question.type === EQuestionType.MULTIPLE_CHOICE
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
            attemptDetail.question.type ===
            EQuestionType.MULTIPLE_SELECTION_ANSWER
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
          } else if (attemptDetail.question.type === EQuestionType.SCORING) {
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
        index++;
      }
      score =
        ((totalCorrect * defaultScorePerQuestion + point) / maxScore) * 100;
      attempt = {
        ...attempt,
        total_correct: totalCorrect + totalCorrectByScoring,
        total_question: totalQuestion,
        score: String(score),
        finished: true,
      };
      await this.updateLatestAttempt(query, attempt);
      // finished completion when score >= 70
      if (score >= 70) {
        const tmpUpdateData = {
          score: String(score),
          finished: true,
          progress: '100',
        };
        await this.repository.update(completion.id, tmpUpdateData);
      } else {
        const tmpUpdateData = {
          score: String(score),
          finished: false,
        };
        await this.repository.update(completion.id, tmpUpdateData);
      }
      // is class finished ?
      const classCompletion = await this.getCompletionByClassId(
        query.class_id,
        query.user_id,
        headers
      );
      if (classCompletion && classCompletion.finished) {
        const userData = await this.accountInvokeService.findOne(
          query.user_id,
          headers
        );
        const classData = await this.classInvokeService.findOne(
          query.class_id,
          headers
        );
        const certificateData = {
          user: userData,
          class: classData,
          completion: classCompletion,
        };
        this.certificateInvokeService.create(certificateData, headers);
      }
      // end check
      return await this.getLatestAttempt(query);
    } catch (error) {
      Promise.reject(error);
    }
  }

  async generateCertificateData(classCompletion: any, headers: any): Promise<any> {
    try {
      // is class finished ?
      if (classCompletion && classCompletion.finished) {
        const userData = await this.accountInvokeService.findOne(
          classCompletion.user_id,
          headers
        );
        const classData = await this.classInvokeService.findOne(
          classCompletion.class_id,
          headers
        );
        const certificateData = {
          user: userData,
          class: classData,
          completion: classCompletion,
        };
        this.certificateInvokeService.create(certificateData, headers);
      }
      // end check
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
