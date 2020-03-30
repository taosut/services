import { ApiModelProperty } from '@nestjs/swagger';

export class AnswerDto {
  @ApiModelProperty({
    required: false,
    type: 'string',
    description: 'Strings must be uuid',
  })
  id?: string;

  @ApiModelProperty({ required: true })
  answer: string;

  @ApiModelProperty({ required: true })
  correct: boolean;

  @ApiModelProperty({
    required: true,
    type: 'string',
    description: 'Strings must be uuid and uuid is available in questions',
  })
  question_id?: string;
}

// tslint:disable-next-line: max-classes-per-file
export class AnswerUpdateDto extends AnswerDto {
  @ApiModelProperty()
  readonly id: string;

  @ApiModelProperty({
    type: 'string',
    description: 'Strings must be uuid and uuid is available in questions',
  })
  readonly question_id?: string;
}
