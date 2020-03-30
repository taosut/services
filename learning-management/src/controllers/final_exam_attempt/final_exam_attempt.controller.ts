import { Controller, Body, Param,
  BadRequestException, HttpException } from '@nestjs/common';
import { FinalExamAttemptService } from '../../providers/final_exam_attempt/final_exam_attempt.service';
import { UpdateFinalExamAttemptDto } from '../../models/final_exam_attempt/final_exam_attempt.dto';
import { ApiUseTags } from '@nestjs/swagger';
import { convertResponse, convertDate } from '../_plugins/converter';

@ApiUseTags('Final Exam Attempt')
@Controller('final_exam_attempt')
export class FinalExamAttemptController {
  constructor(private readonly finalExamAttemptService: FinalExamAttemptService) {}

  // @Put(':id')
  // @ApiImplicitParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateFinalExamAttemptDto): Promise<object> {
    try {
      const data = await updateDto;

      let result = await this.finalExamAttemptService.update(id, data);

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
