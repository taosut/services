import { ApiModelProperty } from '@nestjs/swagger';
import uuid = require('uuid');

export class CreateFinalExamAttemptDetailDto {
  @ApiModelProperty({required: false, type: 'string', description: 'Strings must be uuid'})
  readonly id: string;
  @ApiModelProperty({required: true})
  readonly question: string;
  @ApiModelProperty({required: false})
// tslint:disable-next-line: variable-name
  readonly sort_order: number;
  @ApiModelProperty({required: true, type: 'string', description: 'Strings must be uuid and uuid is available in question list'})
// tslint:disable-next-line: variable-name
  readonly question_id: string;
  @ApiModelProperty({required: true, type: 'string', description: 'Strings must be uuid and uuid is available in answer list'})
// tslint:disable-next-line: variable-name
  readonly choosen_answer_id: string;
  @ApiModelProperty({required: true, type: 'string', description: 'Strings must be uuid and uuid is available in answer list'})
// tslint:disable-next-line: variable-name
  readonly correct_answer_id: string;
  @ApiModelProperty({required: true, type: 'string', description: 'Strings must be uuid and uuid is available in final exam attempt list'})
// tslint:disable-next-line: variable-name
  readonly attempt_id: string;
}

// tslint:disable-next-line: max-classes-per-file
export class UpdateFinalExamAttemptDetailDto {
  @ApiModelProperty({required: true})
  readonly question: string;
  @ApiModelProperty({required: false})
// tslint:disable-next-line: variable-name
  readonly sort_order: number;
}

// tslint:disable-next-line: max-classes-per-file
export class SubmitAnswerObjectDto {
  @ApiModelProperty({required: true})
  // tslint:disable-next-line: variable-name
  readonly question_id: string;
  @ApiModelProperty({required: true})
  // tslint:disable-next-line: variable-name
  readonly answer_id: string;
}

// tslint:disable-next-line: max-classes-per-file
export class SubmitAnswerDto {
  @ApiModelProperty({required: false, type: 'boolean', default: false, example: false})
  readonly finished: boolean;
  @ApiModelProperty({required: true, isArray: true, example: [{question_id: uuid.v4(), answer_id: '10402b1d-70e4-4ecb-87b5-a88d43995d5b'}]})
  // tslint:disable-next-line: variable-name
  readonly choosen_answers: SubmitAnswerObjectDto[];
}
