import {
  Controller,
  Headers,
  HttpException,
  Param,
  Query,
} from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  GetManyDefaultResponse,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';

import { QueryExternalJoin } from '../../../exam/exam.dto';
import { Answer } from './answer.entity';
import { AnswerService } from './answer.service';

@Crud({
  model: {
    type: Answer,
  },
  params: {
    questionId: {
      field: 'question_id',
      type: 'string',
    },
    id: {
      field: 'id',
      type: 'string',
      primary: true,
    },
  },
  query: {
    join: {
      question: {
        exclude: ['description'],
      },
    },
  },
})
@ApiUseTags('Answer')
@Controller('/question/:questionId/answer')
export class AnswerController implements CrudController<Answer> {
  constructor(public service: AnswerService) {}

  get base(): CrudController<Answer> {
    return this;
  }

  @Override()
  async getMany(
    @ParsedRequest() req: CrudRequest,
    @Query() query: QueryExternalJoin,
    @Headers('realm') realm: string,
    @Headers('authorization') authorization: string
  ): Promise<any> {
    let withContents = false;
    if (query.external_join && query.external_join === 'contents') {
      withContents = true;
    }
    const results: any = await this.base.getManyBase(req);
    let newResults = [];
    if (withContents) {
      for (const data of results) {
        const newRes = await this.service.resolveContent(data, {
          realm,
          authorization,
        });
        newResults.push(newRes);
      }
    } else {
      newResults = results;
    }
    return newResults;
  }

  @Override('getOneBase')
  async getOneAndDoStuff(
    @ParsedRequest() req: CrudRequest,
    @Query() query: QueryExternalJoin,
    @Headers('realm') realm: string,
    @Headers('authorization') authorization: string
  ): Promise<any> {
    let withContents = false;
    if (query.external_join && query.external_join === 'contents') {
      withContents = true;
    }
    const res = await this.base.getOneBase(req);
    let newRes: any;
    if (withContents) {
      newRes = await this.service.resolveContent(res, {
        realm,
        authorization,
      });
    } else {
      newRes = res;
    }
    return newRes;
  }

  @Override('getManyBase')
  async getAll(
    @ParsedRequest() req: CrudRequest,
    @Param('questionId') questionId: string
  ): Promise<GetManyDefaultResponse<Answer> | Answer[]> {
    try {
      return await this.service.getList(req, questionId);
    } catch (error) {
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
