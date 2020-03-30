import { ApiModelProperty } from '@nestjs/swagger';
import { CreateFinalExamAnswerDto, UpdateFinalExamAnswerDto } from '../final_exam_answer/final_exam_answer.dto';

export class CreateFinalExamQuestionDto {
  @ApiModelProperty({required: true})
  readonly question: string;
  @ApiModelProperty({required: true, type: 'string', description: 'Strings must be uuid and uuid is available in questions'})
// tslint:disable-next-line: variable-name
  readonly final_exam_id: string;
  @ApiModelProperty({required: true, type: 'array', isArray: true, example: [ {answer: 'Choice A', correct: true} ]})
  readonly answers: CreateFinalExamAnswerDto[];
}

// tslint:disable-next-line: max-classes-per-file
export class UpdateFinalExamQuestionDto {
  @ApiModelProperty({required: true})
  readonly question: string;
  @ApiModelProperty({required: true, type: 'array', isArray: true, example: [ {answer: 'Choice A', correct: true} ]})
  readonly answers: UpdateFinalExamAnswerDto[];
}
