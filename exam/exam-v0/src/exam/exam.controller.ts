import { Controller, Delete, HttpException, Param, Put } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { DeleteResult } from 'typeorm';
import { Exam } from './exam.entity';
import { ExamService } from './exam.service';

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
}
