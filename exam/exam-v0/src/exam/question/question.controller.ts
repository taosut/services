import {
  Body,
  Controller,
  Delete,
  HttpException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
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
export class QuestionController {
  constructor(public service: QuestionService) {}

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
