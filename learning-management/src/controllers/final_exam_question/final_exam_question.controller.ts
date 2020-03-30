import { Controller, Post, Body, Param,
  NotFoundException, BadRequestException, Put, Delete, HttpException, Inject, forwardRef, Logger } from '@nestjs/common';
import { FinalExamQuestionService } from '../../providers/final_exam_question/final_exam_question.service';
import { FinalExamQuestion } from '../../models/final_exam_question/final_exam_question.entity';
import { CreateFinalExamQuestionDto, UpdateFinalExamQuestionDto } from '../../models/final_exam_question/final_exam_question.dto';
import { ApiImplicitParam, ApiUseTags } from '@nestjs/swagger';
import { convertResponse, convertDate } from '../_plugins/converter';
import { CreateFinalExamAnswerDto } from '../../models/final_exam_answer/final_exam_answer.dto';
import { FinalExamAnswer } from '../../models/final_exam_answer/final_exam_answer.entity';
import { FinalExamAnswerService } from '../../providers/final_exam_answer/final_exam_answer.service';
import { FinalExamService } from '../../providers/final_exam/final_exam.service';
import uuid = require('uuid');

@ApiUseTags('Final Exam Question')
@Controller('final_exam_question')
export class FinalExamQuestionController {
  constructor(private readonly finalExamQuestionService: FinalExamQuestionService,
              private readonly finalExamService: FinalExamService,
              private readonly finalExamAnswerService: FinalExamAnswerService) {}

  // @Get(':id')
  // @ApiImplicitParam({ name: 'id', description: 'Slug can replace with id. Example : the-title or 049ddb16-9f0f-41a2-90e6-39b8768c8184' })
  // async findOne(@Param('id') id): Promise<object> {
  //   let final_exam_question;
  //   if (validate(id)) {
  //     final_exam_question = await this.finalExamQuestionService.findOne({id});

  //     if (!final_exam_question) {
  //       throw new NotFoundException('Not Found');
  //     }
  //   }

  //   final_exam_question = convertDate(final_exam_question);
  //   return convertResponse(final_exam_question);
  // }

  @Post()
  async create(@Body() createDto: CreateFinalExamQuestionDto): Promise<object> {
    try {
      let finalExam;
      finalExam = await this.finalExamService.findOne({id: createDto.final_exam_id});
      Logger.debug(JSON.stringify(createDto));
      Logger.debug('finalExam ' + JSON.stringify(finalExam));

      if (!finalExam) {
        throw new NotFoundException('Final Exam is not Found');
      }

      const baseData = new FinalExamQuestion();
      const createData: FinalExamQuestion = Object.assign(baseData, createDto);

      const createQuestion = await this.finalExamQuestionService.create(createData);
      const listAnswer: FinalExamAnswer[] = [];
      const dataAnswer: CreateFinalExamAnswerDto[] = createDto.answers;
      for (const answer of dataAnswer) {
        const baseFinalExamAnswerData = new FinalExamAnswer();
        const inputFinalExamAnswerData = {
          id: uuid.v4(),
          answer: answer.answer,
          correct: answer.correct,
          question_id: createQuestion.id,
        };
        const createFinalExamAnswerData = Object.assign(baseFinalExamAnswerData, inputFinalExamAnswerData);
        const resultAnswer = await this.finalExamAnswerService.create(createFinalExamAnswerData);
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
  async update(@Param('id') id: string, @Body() updateDto: UpdateFinalExamQuestionDto): Promise<object> {
    try {
      const data: any = await updateDto;

      const question = await this.finalExamQuestionService.findOne({id});
      if (!question) {
        throw new NotFoundException('Question is not found');
      }

      const listUpdateAnswer = updateDto.answers;
      delete data.answers;

      let resultUpdateQuestion = await this.finalExamQuestionService.update(id, data);

      const listUpdatedAnswer = [];
      // update if answer is already exist, create if not
      for (let updateAnswer of listUpdateAnswer) {
        // Logger.debug(JSON.stringify(updateAnswer));
        let isAnswerExist = false;
        if (updateAnswer.id) {
          const findAnswer = await question.answers.find(item => item.id === updateAnswer.id);
          if (findAnswer) {
            isAnswerExist = true;
            updateAnswer = {
              ...updateAnswer,
              ...findAnswer,
            };
          }
        }
        // Logger.debug(JSON.stringify(updateAnswer));

        updateAnswer = {
          ...updateAnswer,
          question_id: id,
        };

        if (isAnswerExist) {
          // Logger.debug('Answer Exist : ' + JSON.stringify(isAnswerExist));
          // update
          const updatedAnswer = await this.finalExamAnswerService.update(updateAnswer.id, updateAnswer);
          listUpdatedAnswer.push(updatedAnswer);
        } else {
          // Logger.debug('Answer not Exist : ' + JSON.stringify(isAnswerExist));
          // create
          const baseAnswer = new FinalExamAnswer();
          const newAnswer = Object.assign(baseAnswer, updateAnswer);
          const createdAnswer = await this.finalExamAnswerService.create(newAnswer);
          listUpdatedAnswer.push(createdAnswer);
        }
      }

      resultUpdateQuestion = {
        ...resultUpdateQuestion,
        answers: listUpdatedAnswer,
      };

      resultUpdateQuestion = convertDate(resultUpdateQuestion);
      return convertResponse(resultUpdateQuestion);
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
      let result = await this.finalExamQuestionService.delete(id);

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
      let result = await this.finalExamQuestionService.restore(id);

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
      let result = await this.finalExamQuestionService.forceDelete(id);

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
