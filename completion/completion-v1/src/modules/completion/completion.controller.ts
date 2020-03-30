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
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { CrudController } from '@nestjsx/crud';
import { getUserId } from '../../utils/auth';
import {
  AnswerObjectSubmitDto,
  QueryGetAttemptDto,
} from '../attempt/attempt.dto';
import {
  NextCompletionDto,
  NextCompletionResponseDto,
  UpdateCompletionDto,
} from './completion.dto';
import { Completion } from './completion.entity';
import { CompletionService } from './completion.service';
import { GenerateCompletionDto } from './types/completion.dto';

@ApiUseTags('Completion')
@Controller('completion')
export class CompletionController implements CrudController<Completion> {
  constructor(public service: CompletionService) {}

  get base(): CrudController<Completion> {
    return this;
  }

  @ApiOperation({
    title: 'Generate initial completion',
  })
  @Post('generate')
  async generateInitialCompletion(
    @Headers('authorization') authorization: string,
    @Headers('realm') realm: string,
    @Body() dto: GenerateCompletionDto
  ): Promise<Completion> {
    try {
      console.info('===== GENERATE COMPLETION =====');
      return await this.service.generateInitialCompletion(dto, {
        authorization,
        realm,
      });
    } catch (err) {
      throw new HttpException(
        err.message || err,
        err.statusCode || err.status || 500
      );
    }
  }

  @ApiOperation({
    title: 'Get next unit',
  })
  @Post('next')
  async nextUnit(
    @Body() dto: NextCompletionDto,
    @Headers('authorization') authorization: string,
    @Headers('realm') realm: string
  ): Promise<NextCompletionResponseDto> {
    const userId = getUserId(authorization);
    if (!userId) {
      throw new HttpException('Unauthorized', 401);
    }

    return await this.service.nextCompletion(
      {
        class_id: dto.class_id,
        user_id: userId,
      },
      { authorization, realm }
    );
  }

  @ApiOperation({
    title: 'Update completion',
  })
  @Put()
  async updateCompletion(
    @Body() dto: UpdateCompletionDto,
    @Headers('authorization') authorization: string,
    @Headers('realm') realm: string
  ): Promise<Completion> {
    const userId = getUserId(authorization);
    if (!userId) {
      throw new HttpException('Unauthorized', 401);
    }

    const response = await this.service.updateCompletion(dto, userId, {
      realm,
      authorization,
    });

    return response;
  }

  @ApiOperation({
    title: 'Get class completion',
  })
  @Get(':classId')
  async getCompletionByClass(
    @Param('classId') classId: string,
    @Param('trackId') trackId: string,
    @Param('unitId') unitId: string,
    @Headers('authorization') authorization: string,
    @Headers('realm') realm: string
  ): Promise<Completion> {
    const userId = getUserId(authorization);
    if (!userId) {
      throw new HttpException('Unauthorized', 401);
    }
    const response = await this.service.getCompletionByClassId(
      classId,
      userId,
      { realm, authorization }
    );

    return response;
  }

  @ApiOperation({
    title: 'Get track completion',
  })
  @Get(':classId/:trackId')
  async getCompletionByTrack(
    @Param('classId') classId: string,
    @Param('trackId') trackId: string,
    @Param('unitId') unitId: string,
    @Headers('authorization') authorization: string
  ): Promise<Completion> {
    const userId = getUserId(authorization);
    if (!userId) {
      throw new HttpException('Unauthorized', 401);
    }
    const response = await this.service.getCompletionByTrackId(trackId, userId);

    return response;
  }

  @ApiOperation({
    title: 'Get unit completion',
  })
  @Get(':classId/:trackId/:unitId')
  async getCompletionByUnit(
    @Param('classId') classId: string,
    @Param('trackId') trackId: string,
    @Param('unitId') unitId: string,
    @Headers('authorization') authorization: string
  ): Promise<Completion> {
    const userId = getUserId(authorization);
    if (!userId) {
      throw new HttpException('Unauthorized', 401);
    }
    const response = await this.service.getCompletionByUnitId(unitId, userId);

    return response;
  }

  // ATTEMPT EXAM
  @ApiOperation({ title: 'Get result of exam' })
  @Get(':classId/:trackId/:unitId/exam')
  async findOne(
    @Param('classId') classId: string,
    @Param('trackId') trackId: string,
    @Param('unitId') unitId: string,
    @Headers('authorization') authorization: string
  ): Promise<object> {
    const userId = getUserId(authorization);
    if (!userId) {
      throw new HttpException('Unauthorized', 401);
    }
    try {
      const query: QueryGetAttemptDto = {
        class_id: classId,
        track_id: trackId,
        unit_id: unitId,
        user_id: userId,
      };
      const res = await this.service.getLatestAttempt(query);
      if (res) {
        return res;
      } else {
        throw new HttpException(
          'Attempt is not found. You have never started an exam.',
          404
        );
      }
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

  @ApiOperation({
    title: 'Start Exam. Will Generate Random Question and Answer',
  })
  @Post(':classId/:trackId/:unitId/exam')
  async start(
    @Param('classId') classId: string,
    @Param('trackId') trackId: string,
    @Param('unitId') unitId: string,
    @Headers('authorization') authorization: string,
    @Headers('realm') realm: string
  ): Promise<object> {
    console.info('start exam');
    const userId = getUserId(authorization);
    if (!userId) {
      throw new HttpException('Unauthorized', 401);
    }
    try {
      const query: QueryGetAttemptDto = {
        class_id: classId,
        track_id: trackId,
        unit_id: unitId,
        user_id: userId,
      };
      return await this.service.start(query, { authorization, realm });
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

  @ApiOperation({ title: 'Submit answer' })
  @Post(':classId/:trackId/:unitId/exam/answer')
  async submitAnswer(
    @Param('classId') classId: string,
    @Param('trackId') trackId: string,
    @Param('unitId') unitId: string,
    @Body() body: AnswerObjectSubmitDto,
    @Headers('authorization') authorization: string
  ): Promise<object> {
    const userId = getUserId(authorization);
    if (!userId) {
      throw new HttpException('Unauthorized', 401);
    }
    try {
      const query: QueryGetAttemptDto = {
        class_id: classId,
        track_id: trackId,
        unit_id: unitId,
        user_id: userId,
      };
      return await this.service.submit(query, body);
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

  @ApiOperation({
    title:
      'Submit answer and get status of submitted answer (correct or wrong)',
  })
  @Post(':classId/:trackId/:unitId/exam/answer/check')
  async submitAnswerAndCheck(
    @Param('classId') classId: string,
    @Param('trackId') trackId: string,
    @Param('unitId') unitId: string,
    @Body() body: AnswerObjectSubmitDto,
    @Headers('authorization') authorization: string
  ): Promise<object> {
    const userId = getUserId(authorization);
    if (!userId) {
      throw new HttpException('Unauthorized', 401);
    }
    try {
      const query: QueryGetAttemptDto = {
        class_id: classId,
        track_id: trackId,
        unit_id: unitId,
        user_id: userId,
      };
      return await this.service.submit(query, body, true);
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

  @ApiOperation({
    title: 'Finish exam and calculate score. Will return result of exam',
  })
  @Post(':classId/:trackId/:unitId/exam/finish')
  @HttpCode(200)
  async finish(
    @Param('classId') classId: string,
    @Param('trackId') trackId: string,
    @Param('unitId') unitId: string,
    @Headers('authorization') authorization: string,
    @Headers('realm') realm: string
  ): Promise<object> {
    const userId = getUserId(authorization);
    if (!userId) {
      throw new HttpException('Unauthorized', 401);
    }
    try {
      const query: QueryGetAttemptDto = {
        class_id: classId,
        track_id: trackId,
        unit_id: unitId,
        user_id: userId,
      };
      return await this.service.finish(query, { authorization, realm });
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
