import { Controller, Body, Param,
  BadRequestException, HttpException } from '@nestjs/common';
import { QuizAttemptService } from '../../providers/quizattempt/quizattempt.service';
import { UpdateQuizAttemptDto } from '../../models/quizattempt/quizattempt.dto';
import { ApiUseTags } from '@nestjs/swagger';
import { convertResponse, convertDate } from '../_plugins/converter';

@ApiUseTags('Quiz Attempt')
@Controller('quiz_attempt')
export class QuizAttemptController {
  constructor(private readonly quizAttemptService: QuizAttemptService) {}

  // @Put(':id')
  // @ApiImplicitParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateQuizAttemptDto): Promise<object> {
    try {
      const data = await updateDto;

      let result = await this.quizAttemptService.update(id, data);

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
