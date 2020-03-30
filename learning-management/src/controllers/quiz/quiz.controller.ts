import {
  Controller, Get, Post, Body, Param, NotFoundException,
  BadRequestException, Query,
  HttpException, Logger } from '@nestjs/common';
import { LessonService } from '../../providers/lesson/lesson.service';
import { Lesson } from '../../models/lesson/lesson.entity';
import { ApiImplicitParam, ApiImplicitQuery, ApiUseTags } from '@nestjs/swagger';
import { convertResponse, convertDate, shuffle } from '../_plugins/converter';
import { QuizQuestionService } from '../../providers/quizquestion/quizquestion.service';
import { QuizAttemptService } from '../../providers/quizattempt/quizattempt.service';
import { QuizAttempt } from '../../models/quizattempt/quizattempt.entity';
import { QuizAttemptDetail } from '../../models/quizattemptdetail/quizattemptdetail.entity';
import { CreateQuizAttemptDetailDto, SubmitAnswerDto } from '../../models/quizattemptdetail/quizattemptdetail.dto';
import { CreateQuizAttemptDto, UpdateQuizAttemptDto } from '../../models/quizattempt/quizattempt.dto';
import { QuizAttemptDetailService } from '../../providers/quizattemptdetail/quizattemptdetail.service';
import * as validate from 'uuid-validate';
import * as uuid from 'uuid';
import { AuthService } from '../../_handler/auth/auth.service';

@ApiUseTags('Quiz')
@Controller('quiz')
export class QuizController {
  private readonly authService: AuthService;
  constructor(private readonly lessonService: LessonService,
              private readonly quizQuestionService: QuizQuestionService,
              private readonly quizAttemptService: QuizAttemptService,
              private readonly quizAttemptDetailService: QuizAttemptDetailService) {
                this.authService = new AuthService();
              }

  @Get(':slug')
  @ApiImplicitParam({ name: 'slug', description: 'Slug can replace with id. Example : the-title or 049ddb16-9f0f-41a2-90e6-39b8768c8184' })
  @ApiImplicitQuery({ name: 'with_questions', type: 'boolean', required: false })
  async findOne(@Param('slug') slug, @Query() query): Promise<object> {
    try {
      let lesson;
      if (validate(slug)) {
        lesson = await this.lessonService.findOne({id: slug});

        if (!lesson) {
          throw new NotFoundException('Not Found');
        }
      } else {
        lesson = await this.lessonService.findOne({slug});

        if (!lesson) {
          throw new NotFoundException('Not Found');
        }
      }

      // get list questions
      if (query.with_questions === true || query.with_questions === 'true') {
        query = {
          where: {
            quiz_id: lesson.id,
            deleted_at: null,
          },
        };
        const questions = await this.quizQuestionService.findAll(query);
        lesson = {
          ...lesson,
          questions,
        };
      }

      if (lesson && lesson.lesson_type !== 'quiz') {
        throw new NotFoundException('Quiz is not found');
      }

      lesson = convertDate(lesson);
      return convertResponse(lesson);
    } catch (error) {
      Logger.error(JSON.stringify(error));
      if (error.statusCode) {
        throw new HttpException(error.message, error.statusCode);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }

  @Get(':slug/questions')
  @ApiImplicitParam({ name: 'slug', description: 'Slug can replace with id. Example : the-title or 049ddb16-9f0f-41a2-90e6-39b8768c8184' })
  @ApiImplicitQuery({ name: 'page', required: false })
  @ApiImplicitQuery({ name: 'per_page', required: false, enum: ['5', '10', '50', '100', '500', '1000', 'no-paginate'] })
  @ApiImplicitQuery({ name: 'keyword', required: false })
  @ApiImplicitQuery({ name: 'filter', required: false, enum: ['all', 'trash'] })
  async findOneWithQuestion(@Query() query, @Param('slug') slug): Promise<object> {
    try {
      let lesson;
      if (validate(slug)) {
        lesson = await this.lessonService.findOne({id: slug});

        if (!lesson) {
          throw new NotFoundException('Not Found');
        }
      } else {
        lesson = await this.lessonService.findOne({slug});

        if (!lesson) {
          throw new NotFoundException('Not Found');
        }
      }

      if (lesson && lesson.lesson_type !== 'quiz') {
        throw new NotFoundException('Quiz is not found');
      }

      // get question list
      let perPage: number|string = 5;
      if (query.per_page) {
        perPage = query.per_page;
      } else {
        perPage = 5;
      }

      query = {
        ...query,
        where: {
          quiz_id: lesson.id,
          deleted_at: null,
        },
      };
      let result = null;
      if (query.filter === 'trash') {
        query = {
          ...query,
          where: {
            deleted_at: 'IS NOT NULL',
          },
        };
      }

      if (perPage === 'no-paginate') {
        result = await this.quizQuestionService.findAll(query);
      } else {
        query = {
          ...query,
          per_page: Number(perPage),
        };
        result = await this.quizQuestionService.findAllWithPagination(query);
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

  @Post(':slug/start')
  @ApiImplicitParam({ name: 'slug', description: 'Slug can replace with id. Example : the-title or 049ddb16-9f0f-41a2-90e6-39b8768c8184' })
  async startQuiz(@Param('slug') slug): Promise<object> {
    try {
      const userId = await this.authService.getUserId('learner');
      let lesson;

      if (validate(slug)) {
        lesson = await this.lessonService.findOne({id: slug});

        if (!lesson) {
          throw new NotFoundException('Not Found');
        }
      } else {
        lesson = await this.lessonService.findOne({slug});

        if (!lesson) {
          throw new NotFoundException('Not Found');
        }
      }

      if (lesson && lesson.lesson_type !== 'quiz') {
        throw new NotFoundException('Quiz is not found');
      }

      const queryQuestion = {
        where: {
          quiz_id: lesson.id,
          deleted_at: null,
        },
      };
      const listQuestion = await this.quizQuestionService.findAll(queryQuestion);

      if (listQuestion.length === 0) {
        throw new BadRequestException('There is not question');
      }

      /** DEFINE VARIABLE
       */
      let createAttempt: object[];

      /** SHUFFLE QUESTION
       */
      const shuffleQuestions = shuffle(listQuestion);

      /** START QUIZ
       */
      const whereQuizAndUser = {
        quiz_id: lesson.id,
        user_id: userId,
      };
      const quizAttempt = await this.quizAttemptService.findOne(whereQuizAndUser);
      if (!quizAttempt) {
        createAttempt = await this.createNewAttempt(lesson, shuffleQuestions);
        Logger.debug(createAttempt);
      } else {
        // attempt is exist
        Logger.debug('attempt is exist');
        if (quizAttempt.finished) {
          // update existing attempt
          await this.reAttempt(quizAttempt, shuffleQuestions);
        } else {
          // calculate duration
          const latestStartAt = new Date(quizAttempt.latest_started_at);
          const latestStartAtTime = latestStartAt.getTime();
          const now = new Date();
          const nowTime = now.getTime();
          const diffSecond = (nowTime - latestStartAtTime) / 1000;
          Logger.debug('latestStartAt : ' + latestStartAt);
          Logger.debug('now : ' + now);
          Logger.debug('diffSecond : ' + diffSecond);

          if (diffSecond > quizAttempt.quiz.duration) {
            Logger.debug('Time\'s up');

            // calculate score and submit

            // throw error
            throw new BadRequestException('TIME\'S UP');
          }
        }
      }

      let result = await this.quizAttemptService.findOne(whereQuizAndUser);

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
      let lesson;

      if (validate(slug)) {
        lesson = await this.lessonService.findOne({id: slug});

        if (!lesson) {
          throw new NotFoundException('Not Found');
        }
      } else {
        lesson = await this.lessonService.findOne({slug});

        if (!lesson) {
          throw new NotFoundException('Not Found');
        }
      }

      if (lesson && lesson.lesson_type !== 'quiz') {
        throw new NotFoundException('Quiz is not found');
      }

      const queryQuestion = {
        where: {
          quiz_id: lesson.id,
          deleted_at: null,
        },
      };
      const listQuestion = await this.quizQuestionService.findAll(queryQuestion);

      if (listQuestion.length === 0) {
        throw new BadRequestException('There is not question');
      }

      const whereQuizAndUser = {
        quiz_id: lesson.id,
        user_id: userId,
      };
      let quizAttempt = await this.quizAttemptService.findOne(whereQuizAndUser);
      if (!quizAttempt) {
        throw new NotFoundException('Quiz attempt is not found');
      }
      if (quizAttempt && quizAttempt.finished) {
        throw new BadRequestException('Quiz attempt has been already finished');
      }
      // calculate duration
      const latestStartAt = new Date(quizAttempt.latest_started_at);
      const latestStartAtTime = latestStartAt.getTime();
      const now = new Date();
      const nowTime = now.getTime();
      const diffSecond = (nowTime - latestStartAtTime) / 1000;
      Logger.debug('latestStartAt : ' + latestStartAt);
      Logger.debug('now : ' + now);
      Logger.debug('diffSecond : ' + diffSecond);

      let finished = body.finished;
      if (!quizAttempt.finished) {
        if (diffSecond > quizAttempt.quiz.duration) {
          Logger.debug('Time\'s up');
          finished = true;
        }
      }

      // update answer to attemptDetail
      quizAttempt.attempt_details = await quizAttempt.attempt_details.map(detail => {
        const findAnswerSubmitted = body.choosen_answers.find(item => item.question_id === detail.question_id);
        if (findAnswerSubmitted) {
          detail = {
            ...detail,
            choosen_answer_id: findAnswerSubmitted.answer_id,
          };
          this.quizAttemptDetailService.update(detail.id, detail);
        }
        return detail;
      });

      // when finished or time is up
      if (finished) {
        Logger.debug('Finished');
        // update correct answer id and check
        let totalCorrect = 0;
        quizAttempt.attempt_details = quizAttempt.attempt_details.map(detail => {
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
              this.quizAttemptDetailService.update(detail.id, detail);
            }
            if (correctAnswerId && correctAnswerId === detail.choosen_answer_id) {
              totalCorrect = totalCorrect + 1;
            }
          }
          return detail;
        });

        quizAttempt = {
          ...quizAttempt,
          total_attempted: quizAttempt.total_attempted,
          total_question: quizAttempt.total_question,
          latest_started_at: quizAttempt.latest_started_at,
          total_correct: totalCorrect,
          latest_score: quizAttempt.total_question > 0 ? (totalCorrect / quizAttempt.total_question).toFixed(2) : '0',
          elapsed_time: Number(Number(diffSecond).toFixed(0)),
          finished: true,
        };
      }

      let result = await this.quizAttemptService.update(quizAttempt.id, quizAttempt);

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

  async createNewAttempt(lesson: Lesson, questions: object[] = []) {
    try {
      const userId = await this.authService.getUserId('learner');
      // create new attempt
      Logger.debug('create new attempt');
      const attemptBaseData = new QuizAttempt();

      const inputAttemptData: CreateQuizAttemptDto = {
        id: uuid.v4(),
        total_attempted: 1,
        total_correct: null,
        total_question: questions.length,
        latest_score: null,
        latest_started_at: new Date(),
        elapsed_time: 0,
        finished: false,
        quiz_id: lesson.id,
        user_id: userId,
      };
      const attemptData: QuizAttempt = Object.assign(attemptBaseData, inputAttemptData);
      const createAttempt = await this.quizAttemptService.create(attemptData);
      if (createAttempt) {
        Logger.debug('Success to create Quiz Attempt');
        Logger.debug('Create multiple Quiz Attempt Detail');
        const attemptDetailDatas: any = await questions.map((question: any, key) => {
          const attemptDetailData: CreateQuizAttemptDetailDto = {
            id: uuid.v4(),
            question: question.question,
            sort_order: (key + 1),
            question_id: question.id,
            choosen_answer_id: null,
            correct_answer_id: null,
            quiz_attempt_id: createAttempt.id,
          };
          return attemptDetailData;
        });

        Logger.debug(attemptDetailDatas);

        return await this.quizAttemptDetailService.createMultiple(attemptDetailDatas);
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

  async reAttempt(quizAttempt: QuizAttempt, questions: object[] = []) {
    try {
      // re new attempt
      Logger.debug('re new attempt');
      const attemptBaseData = new QuizAttempt();

      const inputAttemptData: UpdateQuizAttemptDto = {
        total_attempted: quizAttempt.total_attempted + 1,
        total_correct: null,
        total_question: questions.length,
        latest_score: null,
        latest_started_at: new Date(),
        elapsed_time: 0,
        finished: false,
      };
      const attemptData: QuizAttempt = Object.assign(attemptBaseData, inputAttemptData);
      const updateAttempt = await this.quizAttemptService.update(quizAttempt.id, attemptData);
      if (updateAttempt) {
        const ids: string[] = quizAttempt.attempt_details.map(item => item.id);
        if (ids.length > 0) {
          Logger.debug('Success to delete multiple Quiz Attempt Detail');
          Logger.debug('Create multiple Quiz Attempt Detail');

          const attemptDetailDatas: any = await questions.map((question: any, key) => {
            const attemptDetailData: CreateQuizAttemptDetailDto = {
              id: uuid.v4(),
              question: question.question,
              sort_order: (key + 1),
              question_id: question.id,
              choosen_answer_id: null,
              correct_answer_id: null,
              quiz_attempt_id: updateAttempt.id,
            };
            return attemptDetailData;
          });

          Logger.debug(attemptDetailDatas);

          return await this.quizAttemptDetailService.createMultiple(attemptDetailDatas);
        }
      }
    } catch (error) {
      Logger.error(JSON.stringify(error));
      if (error.statusCode) {
        throw new HttpException(error.message, error.statusCode);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }
}
