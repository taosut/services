import { Controller, Body, Param,
  BadRequestException, Put, Delete, HttpException, Logger } from '@nestjs/common';
import { QuizAnswerService } from '../../providers/quizanswer/quizanswer.service';
import { UpdateQuizAnswerDto } from '../../models/quizanswer/quizanswer.dto';
import { ApiImplicitParam, ApiUseTags } from '@nestjs/swagger';
import { convertResponse, convertDate } from '../_plugins/converter';

@ApiUseTags('Quiz Answer')
@Controller('quiz_answer')
export class QuizAnswerController {
  constructor(private readonly quizAnswerService: QuizAnswerService) {}

  @Put(':id')
  @ApiImplicitParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateQuizAnswerDto): Promise<object> {
    try {
      const data = await updateDto;

      let result = await this.quizAnswerService.update(id, data);

      result = convertDate(result);
      return convertResponse(result);
    } catch (error) {
      Logger.error(JSON.stringify(error));
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
      Logger.error(JSON.stringify(error));
      if (error.statusCode) {
        throw new HttpException(error.message, error.statusCode);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }
}
