import { Controller, Body, Param,
  BadRequestException, Put, Delete, HttpException } from '@nestjs/common';
import { FinalExamAnswerService } from '../../providers/final_exam_answer/final_exam_answer.service';
import { UpdateFinalExamAnswerDto } from '../../models/final_exam_answer/final_exam_answer.dto';
import { ApiImplicitParam, ApiUseTags } from '@nestjs/swagger';
import { convertResponse, convertDate } from '../_plugins/converter';

@ApiUseTags('Final Exam Answer')
@Controller('final_exam_answer')
export class FinalExamAnswerController {
  constructor(private readonly quizAnswerService: FinalExamAnswerService) {}

  @Put(':id')
  @ApiImplicitParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateFinalExamAnswerDto): Promise<object> {
    try {
      const data = await updateDto;

      let result = await this.quizAnswerService.update(id, data);

      result = convertDate(result);
      return convertResponse(result);
    } catch (error) {
      if (error.statusCode) {
        throw new HttpException(error.message, error.statusCode);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }

  @Delete(':id')
  @ApiImplicitParam({ name: 'id' })
  async forceDelete(@Param('id') id: string): Promise<object> {
    try {
      let result = await this.quizAnswerService.forceDelete(id);

      result = convertDate(result);
      return convertResponse(result);
    } catch (error) {
      if (error.statusCode) {
        throw new HttpException(error.message, error.statusCode);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }
}
