import { Controller, Post, Body, Param,
  NotFoundException, BadRequestException, Put, Delete, HttpException, Logger, UnprocessableEntityException } from '@nestjs/common';
import { QuizQuestionService } from '../../providers/quizquestion/quizquestion.service';
import { QuizQuestion } from '../../models/quizquestion/quizquestion.entity';
import { CreateQuizQuestionDto, UpdateQuizQuestionDto } from '../../models/quizquestion/quizquestion.dto';
import { ApiImplicitParam, ApiUseTags } from '@nestjs/swagger';
import { convertResponse, convertDate } from '../_plugins/converter';
import { CreateQuizAnswerDto } from '../../models/quizanswer/quizanswer.dto';
import uuid = require('uuid');
import { QuizAnswer } from '../../models/quizanswer/quizanswer.entity';
import { QuizAnswerService } from '../../providers/quizanswer/quizanswer.service';
import { LessonService } from '../../providers/lesson/lesson.service';

@ApiUseTags('Quiz Question')
@Controller('quiz_question')
export class QuizQuestionController {
  constructor(private readonly quizQuestionService: QuizQuestionService,
              private readonly lessonService: LessonService,
              private readonly quizAnswerService: QuizAnswerService) {}

  // @Get(':id')
  // @ApiImplicitParam({ name: 'id', description: 'Slug can replace with id. Example : the-title or 049ddb16-9f0f-41a2-90e6-39b8768c8184' })
  // async findOne(@Param('id') id): Promise<object> {
  //   let quizquestion;
  //   if (validate(id)) {
  //     quizquestion = await this.quizQuestionService.findOne({id});

  //     if (!quizquestion) {
  //       throw new NotFoundException('Not Found');
  //     }
  //   }

  //   quizquestion = convertDate(quizquestion);
  //   return convertResponse(quizquestion);
  // }

  @Post()
  async create(@Body() createDto: CreateQuizQuestionDto): Promise<object> {
    try {
      let lesson;
      lesson = await this.lessonService.findOne({id: createDto.quiz_id});

      if (!lesson) {
        throw new NotFoundException('Quiz is not Found');
      }

      if (lesson && lesson.lesson_type !== 'quiz') {
        throw new NotFoundException('This is not a quiz');
      }

      const baseData = new QuizQuestion();
      const createData: QuizQuestion = Object.assign(baseData, createDto);

      const createQuestion = await this.quizQuestionService.create(createData);
      const listAnswer: QuizAnswer[] = [];
      if (!createDto.answers || (createDto.answers && createDto.answers.length === 0)) {
        throw new UnprocessableEntityException('answers is required. minimum 1 answer.');
      }
      const dataAnswer: CreateQuizAnswerDto[] = createDto.answers;
      for (const answer of dataAnswer) {
        const baseQuizAnswerData = new QuizAnswer();
        const inputQuizAnswerData = {
          id: uuid.v4(),
          answer: answer.answer,
          correct: answer.correct,
          question_id: createQuestion.id,
        };
        const createQuizAnswerData = Object.assign(baseQuizAnswerData, inputQuizAnswerData);
        const resultAnswer = await this.quizAnswerService.create(createQuizAnswerData);

        listAnswer.push(resultAnswer);
      }

      let result = {
        ...createData,
        answers: listAnswer,
      };
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

  @Put(':id')
  @ApiImplicitParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateQuizQuestionDto): Promise<object> {
    try {
      const data = await updateDto;

      let result = await this.quizQuestionService.update(id, data);

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

  @Delete(':id')
  @ApiImplicitParam({ name: 'id' })
  async delete(@Param('id') id: string): Promise<object> {
    try {
      let result = await this.quizQuestionService.delete(id);

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

  @Put(':id/restore')
  @ApiImplicitParam({ name: 'id' })
  async restore(@Param('id') id: string): Promise<object> {
    try {
      let result = await this.quizQuestionService.restore(id);

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

  @Delete(':id/force')
  @ApiImplicitParam({ name: 'id' })
  async forceDelete(@Param('id') id: string): Promise<object> {
    try {
      let result = await this.quizQuestionService.forceDelete(id);

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
}
