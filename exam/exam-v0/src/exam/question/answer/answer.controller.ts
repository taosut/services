import { Controller, HttpException, Param } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  GetManyDefaultResponse,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';

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
