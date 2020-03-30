import { ApiModelProperty } from '@nestjs/swagger';
import { CreateQuizAnswerDto, UpdateQuizAnswerDto } from '../quizanswer/quizanswer.dto';

export class CreateQuizQuestionDto {
  @ApiModelProperty({required: false, type: 'string', description: 'Strings must be uuid'})
  readonly id: string;
  @ApiModelProperty({required: true})
  readonly question: string;
  @ApiModelProperty({required: true, type: 'string', description: 'Strings must be uuid and uuid is available in playlists'})
  readonly quiz_id: string;
  @ApiModelProperty({required: true, type: 'array', isArray: true, example: [ {answer: 'Choice A', correct: true} ]})
  readonly answers: CreateQuizAnswerDto[];
}

export class UpdateQuizQuestionDto {
  @ApiModelProperty({required: true})
  readonly question: string;
  @ApiModelProperty({required: true, type: 'array', isArray: true, example: [ {answer: 'Choice A', correct: true} ]})
  readonly answers: UpdateQuizAnswerDto[];
}