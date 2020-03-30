import {
  Controller, Get, Post, Body, Param, NotFoundException,
  BadRequestException, Query,
  HttpException, Logger } from '@nestjs/common';
import { FinalExamService } from '../../providers/final_exam/final_exam.service';
import { FinalExam } from '../../models/final_exam/final_exam.entity';
import { ApiImplicitParam, ApiImplicitQuery, ApiUseTags } from '@nestjs/swagger';
import { convertResponse, convertDate, shuffle } from '../_plugins/converter';
import { FinalExamQuestionService } from '../../providers/final_exam_question/final_exam_question.service';
import { FinalExamAttemptService } from '../../providers/final_exam_attempt/final_exam_attempt.service';
import { FinalExamAttempt } from '../../models/final_exam_attempt/final_exam_attempt.entity';
import { FinalExamAttemptDetail } from '../../models/final_exam_attempt_detail/final_exam_attempt_detail.entity';
import { CreateFinalExamAttemptDetailDto, SubmitAnswerDto } from '../../models/final_exam_attempt_detail/final_exam_attempt_detail.dto';
import { CreateFinalExamAttemptDto, UpdateFinalExamAttemptDto } from '../../models/final_exam_attempt/final_exam_attempt.dto';
import { FinalExamAttemptDetailService } from '../../providers/final_exam_attempt_detail/final_exam_attempt_detail.service';
import * as validate from 'uuid-validate';
import * as uuid from 'uuid';
import { AuthService } from '../../_handler/auth/auth.service';

@ApiUseTags('[Learner] Final Exam')
@Controller('learner/final_exam')
export class LearnerFinalExamController {
  private readonly authService: AuthService;
  constructor(private readonly finalExamService: FinalExamService,
              private readonly finalExamQuestionService: FinalExamQuestionService,
              private readonly finalExamAttemptService: FinalExamAttemptService,
              private readonly finalExamAttemptDetailService: FinalExamAttemptDetailService) {
                this.authService = new AuthService();
              }

  @Get()
  @ApiImplicitQuery({ name: 'page', required: false })
  @ApiImplicitQuery({ name: 'per_page', required: false, enum: ['5', '10', '50', '100', '500', '1000', 'no-paginate'] })
  @ApiImplicitQuery({ name: 'keyword', required: false })
  @ApiImplicitQuery({ name: 'filter', required: false, enum: ['all', 'trash'] })
  @ApiImplicitQuery({ name: 'sort_order', required: false, enum: ['ASC', 'DESC'] })
  @ApiImplicitQuery({ name: 'order_by', required: false, enum: ['title', 'created_at', 'updated_at'] })
  @ApiImplicitQuery({ name: 'playlist_id', required: false })
  @ApiImplicitQuery({ name: 'course_id', required: false })
  @ApiImplicitQuery({ name: 'track_id', required: false })
  async findAll(@Query() query): Promise<object> {
    try {
      const userId = await this.authService.getUserId('learner');
      /** TRACK
       * Get List Course Users
       */

      let perPage: number|string = 5;
      if (query.per_page) {
        perPage = query.per_page;
      } else {
        perPage = 5;
      }
      let orderBy;
      let sortOrder;
      if (query.order_by) {
        orderBy = query.order_by;
      } else {
        orderBy = 'created_at';
      }
      if (query.sort_order === 'DESC' || query.sort_order === 'desc') {
        sortOrder = query.sort_order;
      } else {
        sortOrder = 'ASC';
      }

      query = {
        ...query,
        per_page: perPage,
        learner_id: userId,
        where: {
          deleted_at: null,
        },
        orderBy: [{
          column: orderBy,
          order: sortOrder,
        }],
      };

      // START FILTER
      if (query.track_id) {
        query = {
          ...query,
          where: {
            ...query.where,
            track_id: query.track_id,
          },
        };
      }
      if (query.course_id) {
        query = {
          ...query,
          where: {
            ...query.where,
            course_id: query.course_id,
          },
        };
      }
      if (query.playlist_id) {
        query = {
          ...query,
          where: {
            ...query.where,
            playlist_id: query.playlist_id,
          },
        };
      }
      // END FILTER

      let result = null;
      if (query.filter === 'trash') {
        query = {
          ...query,
          where: {
            ...query.where,
            deleted_at: 'IS NOT NULL',
          },
        };
      }

      // if (perPage === 'no-paginate') {
      result = await this.finalExamService.findAll(query);
      // } else {
      //   query = {
      //     ...query,
      //     per_page: Number(perPage),
      //   };
      //   result = await this.finalExamService.findAllWithPagination(query);
      // }

      result = convertDate(result);
      return convertResponse(result);
    } catch (error) {
      Logger.error(JSON.stringify(error));
      if (error.statusCode) {
        throw new HttpException(error.message, error.statusCode);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }

  @Post(':slug/start')
  @ApiImplicitParam({ name: 'slug', description: 'Slug can replace with id. Example : the-title or 049ddb16-9f0f-41a2-90e6-39b8768c8184' })
  async startFinalExam(@Param('slug') slug): Promise<object> {
    try {
      const userId = await this.authService.getUserId('learner');
      let finalExam;

      if (validate(slug)) {
        finalExam = await this.finalExamService.findOne({id: slug});

        if (!finalExam) {
          throw new NotFoundException('Not Found');
        }
      } else {
        finalExam = await this.finalExamService.findOne({slug});

        if (!finalExam) {
          throw new NotFoundException('Not Found');
        }
      }

      const queryQuestion = {
        where: {
          final_exam_id: finalExam.id,
          deleted_at: null,
        },
      };
      const listQuestion = await this.finalExamQuestionService.findAll(queryQuestion);

      if (listQuestion.length === 0) {
        throw new BadRequestException('There is not question');
      }
      Logger.debug('finalExam : ' + JSON.stringify(finalExam));

      /** DEFINE VARIABLE
       */
      let createAttempt: object[];

      /** SHUFFLE QUESTION
       */
      const shuffleQuestions = shuffle(listQuestion);
      Logger.debug('shuffleQuestions : ' + JSON.stringify(shuffleQuestions));

      /** START QUIZ
       */
      const whereFinalExamAndUser = {
        final_exam_id: finalExam.id,
        user_id: userId,
      };
      const finalExamAttempt = await this.finalExamAttemptService.findOne(whereFinalExamAndUser);
      Logger.debug('finalExamAttempt : ' + JSON.stringify(finalExamAttempt));
      if (!finalExamAttempt) {
        createAttempt = await this.createNewAttempt(finalExam, shuffleQuestions);
        Logger.debug(createAttempt);
      } else {
        // attempt is exist
        Logger.debug('attempt is exist');
        if (finalExamAttempt.finished) {
          // update existing attempt
          await this.reAttempt(finalExamAttempt, shuffleQuestions);
        } else {
          // calculate duration
          const latestStartAt = new Date(finalExamAttempt.latest_started_at);
          const latestStartAtTime = latestStartAt.getTime();
          const now = new Date();
          const nowTime = now.getTime();
          const diffSecond = (nowTime - latestStartAtTime) / 1000;
          Logger.debug('latestStartAt : ' + latestStartAt);
          Logger.debug('now : ' + now);
          Logger.debug('diffSecond : ' + diffSecond);

          if (diffSecond > finalExamAttempt.final_exam.duration) {
            Logger.debug('Time\'s up');

            // calculate score and submit

            // throw error
            throw new BadRequestException('TIME\'S UP');
          }
        }
      }

      let result = await this.finalExamAttemptService.findOne(whereFinalExamAndUser);

      if (createAttempt && result && result.attempt_details.length !== shuffleQuestions.length) {
        Logger.debug('Replace attempt details value');
        result = {
          ...result,
          attempt_details: shuffleQuestions,
        };
      }

      result = convertDate(result);
      return convertResponse(result);
    } catch (error) {
      Logger.error(JSON.stringify(error));
      if (error.statusCode) {
        throw new HttpException(error.message, error.statusCode);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }

  @Post(':slug/submit')
  @ApiImplicitParam({ name: 'slug', description: 'Slug can replace with id. Example : the-title or 049ddb16-9f0f-41a2-90e6-39b8768c8184' })
  async submitAttempt(@Param('slug') slug, @Body() body: SubmitAnswerDto): Promise<object> {
    try {
      const userId = await this.authService.getUserId('learner');
      let finalExam;

      if (validate(slug)) {
        finalExam = await this.finalExamService.findOne({id: slug});

        if (!finalExam) {
          throw new NotFoundException('Not Found');
        }
      } else {
        finalExam = await this.finalExamService.findOne({slug});

        if (!finalExam) {
          throw new NotFoundException('Not Found');
        }
      }

      const queryQuestion = {
        where: {
          final_exam_id: finalExam.id,
          deleted_at: null,
        },
      };
      const listQuestion = await this.finalExamQuestionService.findAll(queryQuestion);

      if (listQuestion.length === 0) {
        throw new BadRequestException('There is not question');
      }

      const whereFinalExamAndUser = {
        final_exam_id: finalExam.id,
        user_id: userId,
      };
      let finalExamAttempt = await this.finalExamAttemptService.findOne(whereFinalExamAndUser);
      if (!finalExamAttempt) {
        throw new NotFoundException('FinalExam attempt is not found');
      }
      if (finalExamAttempt && finalExamAttempt.finished) {
        throw new BadRequestException('FinalExam attempt has been already finished');
      }
      // calculate duration
      const latestStartAt = new Date(finalExamAttempt.latest_started_at);
      const latestStartAtTime = latestStartAt.getTime();
      const now = new Date();
      const nowTime = now.getTime();
      const diffSecond = (nowTime - latestStartAtTime) / 1000;
      Logger.debug('latestStartAt : ' + latestStartAt);
      Logger.debug('now : ' + now);
      Logger.debug('diffSecond : ' + diffSecond);

      let finished = body.finished;
      if (!finalExamAttempt.finished) {
        if (diffSecond > finalExamAttempt.final_exam.duration) {
          Logger.debug('Time\'s up');
          finished = true;
        }
      }

      // update answer to attemptDetail
      finalExamAttempt.attempt_details = await finalExamAttempt.attempt_details.map(detail => {
        const findAnswerSubmitted = body.choosen_answers.find(item => item.question_id === detail.question_id);
        if (findAnswerSubmitted) {
          detail = {
            ...detail,
            choosen_answer_id: findAnswerSubmitted.answer_id,
          };
          this.finalExamAttemptDetailService.update(detail.id, detail);
        }
        return detail;
      });

      // when finished or time is up
      if (finished) {
        Logger.debug('Finished');
        // update correct answer id and check
        let totalCorrect = 0;
        finalExamAttempt.attempt_details = finalExamAttempt.attempt_details.map(detail => {
          const findQuestionFromList = listQuestion.find(question => question.id === detail.question_id);
          if (findQuestionFromList) {
            const findCorrectAnswer = findQuestionFromList.answers.find(corAnswer => corAnswer.correct === true);
            let correctAnswerId;
            if (findCorrectAnswer) {
              correctAnswerId = findCorrectAnswer.id;
              detail = {
                ...detail,
                correct_answer_id: correctAnswerId,
              };
              this.finalExamAttemptDetailService.update(detail.id, detail);
            }
            if (correctAnswerId && correctAnswerId === detail.choosen_answer_id) {
              totalCorrect = totalCorrect + 1;
            }
          }
          return detail;
        });

        finalExamAttempt = {
          ...finalExamAttempt,
          total_attempted: finalExamAttempt.total_attempted,
          total_question: finalExamAttempt.total_question,
          latest_started_at: finalExamAttempt.latest_started_at,
          total_correct: totalCorrect,
          latest_score: finalExamAttempt.total_question > 0 ? (totalCorrect / finalExamAttempt.total_question).toFixed(2) : '0',
          elapsed_time: Number(Number(diffSecond).toFixed(0)),
          finished: true,
        };
      }

      let result = await this.finalExamAttemptService.update(finalExamAttempt.id, finalExamAttempt);

      result = convertDate(result);
      return convertResponse(result);
    } catch (error) {
      Logger.error(JSON.stringify(error));
      if (error.statusCode) {
        throw new HttpException(error.message, error.statusCode);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }

  async createNewAttempt(finalExam: FinalExam, questions: any[] = []) {
    try {
      const userId = await this.authService.getUserId('learner');
      // create new attempt
      Logger.debug('create new attempt');
      const attemptBaseData = new FinalExamAttempt();

      const inputAttemptData: CreateFinalExamAttemptDto = {
        id: uuid.v4(),
        total_attempted: 1,
        total_correct: null,
        total_question: questions.length,
        latest_score: null,
        latest_started_at: new Date(),
        elapsed_time: 0,
        finished: false,
        final_exam_id: finalExam.id,
        user_id: userId,
      };
      const attemptData: FinalExamAttempt = Object.assign(attemptBaseData, inputAttemptData);
      const createAttempt = await this.finalExamAttemptService.create(attemptData);
      if (createAttempt) {
        Logger.debug('Success to create FinalExam Attempt');
        Logger.debug('Create multiple FinalExam Attempt Detail');
        const listAttemptDetailData = [];
        let i = 1;
        let attemptDetailData: CreateFinalExamAttemptDetailDto;
        for (const tempAttemptData of questions) {
          attemptDetailData = {
            id: uuid.v4(),
            question: tempAttemptData.question,
            sort_order: (i + 1),
            question_id: tempAttemptData.id,
            choosen_answer_id: null,
            correct_answer_id: null,
            attempt_id: createAttempt.id,
          };
          listAttemptDetailData.push(attemptDetailData);
          i++;
        }

        Logger.debug(listAttemptDetailData);

        return await this.finalExamAttemptDetailService.createMultiple(listAttemptDetailData);
      }
    } catch (error) {
      Logger.error('create new attempt');
      Logger.debug(error);
      if (error.statusCode) {
        throw new HttpException(error.message, error.statusCode);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }

  async reAttempt(finalExamAttempt: FinalExamAttempt, questions: object[] = []) {
    try {
      // re new attempt
      Logger.debug('re new attempt');
      const attemptBaseData = new FinalExamAttempt();

      const inputAttemptData: UpdateFinalExamAttemptDto = {
        total_attempted: finalExamAttempt.total_attempted + 1,
        total_correct: null,
        total_question: questions.length,
        latest_score: null,
        latest_started_at: new Date(),
        elapsed_time: 0,
        finished: false,
      };
      const attemptData: FinalExamAttempt = Object.assign(attemptBaseData, inputAttemptData);
      const updateAttempt = await this.finalExamAttemptService.update(finalExamAttempt.id, attemptData);
      if (updateAttempt) {
        const ids: string[] = finalExamAttempt.attempt_details.map(item => item.id);
        if (ids.length > 0) {
          Logger.debug('Success to delete multiple FinalExam Attempt Detail');
          Logger.debug('Create multiple FinalExam Attempt Detail');

          const attemptDetailDatas: any = await questions.map((question: any, key) => {
            const attemptDetailData: CreateFinalExamAttemptDetailDto = {
              id: uuid.v4(),
              question: question.question,
              sort_order: (key + 1),
              question_id: question.id,
              choosen_answer_id: null,
              correct_answer_id: null,
              attempt_id: updateAttempt.id,
            };
            return attemptDetailData;
          });

          Logger.debug(attemptDetailDatas);

          return await this.finalExamAttemptDetailService.createMultiple(attemptDetailDatas);
        }
      }
    } catch (error) {
      Logger.error('re attempt');
      Logger.debug(error);
      if (error.statusCode) {
        throw new HttpException(error.message, error.statusCode);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }
}
