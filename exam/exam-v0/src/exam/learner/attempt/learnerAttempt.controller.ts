import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpException,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { CrudController } from '@nestjsx/crud';

import { getUserId } from '../../../utils/auth';
import { Attempt } from '../../attempt/attempt.entity';
import { AttemptService } from '../../attempt/attempt.service';
import { AnswerObjectSubmitDto } from '../../attempt/attemptDetail/attemptDetail.dto';

@ApiUseTags('[Learner] Attempt')
@Controller('/learner/exam/:examId/attempt')
export class LearnerAttemptController implements CrudController<Attempt> {
  private userId: string;
  constructor(public service: AttemptService) {}

  get base(): CrudController<Attempt> {
    return this;
  }

  @Get()
  async findOne(
    @Param('examId') examId: string,
    @Headers('authorization') authorization: string
  ): Promise<object> {
    this.userId = getUserId(authorization);
    if (!this.userId) {
      throw new HttpException('Unauthorized', 401);
    }
    try {
      const isExist = await this.service.findOne({
        exam_id: examId,
        user_id: this.userId,
      });
      if (!isExist) {
        throw new HttpException('Attempt is not found', 404);
      }
      return isExist;
    } catch (error) {
      Logger.error(JSON.stringify(error));
      if (error.statusCode) {
        throw new HttpException(error.message, error.statusCode);
      } else if (error.status) {
        throw new HttpException(error.message, error.status);
      } else {
        throw new HttpException(error.message, 500);
      }
    }
  }

  @Post()
  async start(
    @Param('examId') examId: string,
    @Headers('authorization') authorization: string
  ): Promise<object> {
    this.userId = getUserId(authorization);
    if (!this.userId) {
      throw new HttpException('Unauthorized', 401);
    }
    try {
      return await this.service.start(examId, this.userId);
    } catch (error) {
      Logger.error(JSON.stringify(error));
      if (error.statusCode) {
        throw new HttpException(error.message, error.statusCode);
      } else if (error.status) {
        throw new HttpException(error.message, error.status);
      } else {
        throw new HttpException(error.message, 500);
      }
    }
  }

  @Post('answer')
  async submitAnswer(
    @Param('examId') examId: string,
    @Body() body: AnswerObjectSubmitDto,
    @Headers('authorization') authorization: string
  ): Promise<object> {
    this.userId = getUserId(authorization);
    if (!this.userId) {
      throw new HttpException('Unauthorized', 401);
    }
    try {
      return await this.service.submit(examId, body, this.userId);
    } catch (error) {
      Logger.error(JSON.stringify(error));
      if (error.statusCode) {
        throw new HttpException(error.message, error.statusCode);
      } else if (error.status) {
        throw new HttpException(error.message, error.status);
      } else {
        throw new HttpException(error.message, 500);
      }
    }
  }

  @Post('finish')
  @HttpCode(200)
  async finish(
    @Param('examId') examId: string,
    @Headers('authorization') authorization: string
  ): Promise<object> {
    this.userId = getUserId(authorization);
    if (!this.userId) {
      throw new HttpException('Unauthorized', 401);
    }
    try {
      return await this.service.finish(examId, this.userId);
    } catch (error) {
      Logger.error(JSON.stringify(error));
      if (error.statusCode) {
        throw new HttpException(error.message, error.statusCode);
      } else if (error.status) {
        throw new HttpException(error.message, error.status);
      } else {
        throw new HttpException(error.message, 500);
      }
    }
  }
}
