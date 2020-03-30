import {
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  Param,
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
import { DeleteResult } from 'typeorm';
import { QueryExternalJoin } from './exam.dto';
import { Exam } from './exam.entity';
import { ExamService } from './exam.service';
import { MetaExam } from './metaExam.type';

@Crud({
  model: {
    type: Exam,
  },
  query: {
    join: {
      questions: {
        exclude: [],
      },
    },
  },
  params: {
    id: {
      field: 'id',
      type: 'string',
      primary: true,
    },
  },
})
@ApiUseTags('Exam')
@Controller('exam')
// @UseGuards(ExamGuard)
// @Roles(DefaultRoles.authenticated)
export class ExamController {
  constructor(public service: ExamService) {}

  get base(): CrudController<Exam> {
    return this;
  }

  @ApiOperation({ title: 'Get exam by unit id' })
  @Get('fetch/byMeta')
  async findExam(@Query() query: MetaExam): Promise<Exam | DeleteResult> {
    try {
      return await this.service.findExam(query);
    } catch (error) {
      throw new HttpException(error, 500);
    }
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
    const res: any = await this.base.getOneBase(req);
    if (withContents && res.questions) {
      res.questions = await this.service.resolveContents(res.questions, {
        realm,
        authorization,
      });
    }
    return res;
  }

  @ApiOperation({ title: 'Soft delete an exam' })
  @Delete(':id/soft')
  async softDelete(@Param('id') id: string): Promise<Exam | DeleteResult> {
    try {
      return await this.service.softDelete(id);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  @ApiOperation({ title: 'Restore an exam' })
  @Put(':id/restore')
  async restore(@Param('id') id: string): Promise<Exam> {
    try {
      return await this.service.restore(id);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  @ApiOperation({ title: 'Publish exam' })
  @Put(':id/publish')
  async publish(@Param('id') id: string): Promise<Exam> {
    try {
      return await this.service.publish(id);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
