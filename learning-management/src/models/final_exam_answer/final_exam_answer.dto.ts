import { ApiModelProperty } from '@nestjs/swagger';

export class CreateFinalExamAnswerDto {
  @ApiModelProperty({required: false, type: 'string', description: 'Strings must be uuid'})
  readonly id: string;
  @ApiModelProperty({required: true})
  readonly answer: string;
  @ApiModelProperty({required: true})
  readonly correct: boolean;
  @ApiModelProperty({required: true, type: 'string', description: 'Strings must be uuid and uuid is available in questions'})
// tslint:disable-next-line: variable-name
  readonly question_id: string;
}

// tslint:disable-next-line: max-classes-per-file
export class UpdateFinalExamAnswerDto {
  @ApiModelProperty({required: false})
  readonly id: string;
  @ApiModelProperty({required: true})
  readonly answer: string;
  @ApiModelProperty({required: true})
  readonly correct: boolean;
  @ApiModelProperty({required: true, type: 'string', description: 'Strings must be uuid and uuid is available in questions'})
// tslint:disable-next-line: variable-name
  readonly question_id: string;
}
