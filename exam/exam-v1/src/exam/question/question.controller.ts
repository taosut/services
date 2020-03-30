import {
  Body,
  Controller,
  Delete,
  Headers,
  HttpException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { QueryExternalJoin } from '../exam.dto';
import { CreateManyQuestionWithAnswerDto } from './question.dto';
import { Question } from './question.entity';
import { QuestionService } from './question.service';

@Crud({
  model: {
    type: Question,
  },
  params: {
    id: {
      field: 'id',
      type: 'string',
      primary: true,
    },
  },
  query: {
    join: {
      answers: {
        exclude: [],
      },
    },
  },
})
@ApiUseTags('Question')
@Controller('question')
export class QuestionController implements CrudController<Question> {
  constructor(public service: QuestionService) {}

  get base(): CrudController<Question> {
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
    let results: any = await this.base.getManyBase(req);
    if (withContents) {
      let datas = [];
      if (results.data) {
        datas = results.data;
      } else {
        datas = results;
      }
      datas = await this.service.resolveContents(datas, {
        realm,
        authorization,
      });
      if (results.data) {
        results = {
          ...results,
          data: datas,
        };
      } else {
        results = datas;
      }
    }
    return results;
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
    let res = await this.base.getOneBase(req);
    if (withContents) {
      res = await this.service.resolveContent(res, {
        realm,
        authorization,
      });
    }
    return res;
  }

  @ApiOperation({ title: 'Soft delete a question' })
  @Delete(':id/soft')
  async softDelete(@Param('id') id: string): Promise<Question> {
    try {
      return await this.service.softDelete(id);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  @ApiOperation({ title: 'Restore a question' })
  @Put(':id/restore')
  async restore(@Param('id') id: string): Promise<Question> {
    try {
      return await this.service.restore(id);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  @ApiOperation({ title: 'Create many question with answers' })
  @Post('bulk/withAnswer')
  async bulkWithAnswer(
    @Body() dto: CreateManyQuestionWithAnswerDto
  ): Promise<any> {
    try {
      return await this.service.createManyWithAnswer(dto);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
