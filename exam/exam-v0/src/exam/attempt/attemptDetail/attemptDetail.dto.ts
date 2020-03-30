import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import uuid = require('uuid');

export class AttemptDetailDto {
  @ApiModelProperty({ required: false })
  readonly id?: string;

  @ApiModelProperty({ required: true })
  readonly question: string;

  @ApiModelProperty({ required: false })
  readonly sort_order: number;

  @ApiModelProperty({
    required: true,
    type: 'string',
    description: 'Strings must be uuid and uuid is available in question list',
  })
  readonly question_id: string;

  @ApiModelProperty({
    required: true,
    type: 'string',
    isArray: true,
    description: 'Strings must be uuid and uuid is available in answer list',
  })
  readonly choosen_answer_ids?: string[] | null;

  @ApiModelProperty({
    required: true,
    type: 'string',
    isArray: true,
    description: 'Strings must be uuid and uuid is available in answer list',
  })
  readonly correct_answer_ids?: string[] | null;

  @ApiModelProperty({
    required: true,
    type: 'string',
    description:
      'Strings must be uuid and uuid is available in final exam attempt list',
  })
  readonly attempt_id: string;
}

// tslint:disable-next-line: max-classes-per-file
export class AttemptDetailUpdateDto {
  @ApiModelProperty({ required: true })
  readonly question: string;

  @ApiModelProperty({ required: false })
  readonly sort_order: number;
}

// tslint:disable-next-line: max-classes-per-file
export class AnswerObjectSubmitDto {
  @ApiModelProperty({ required: true })
  readonly question_id: string;

  @ApiModelPropertyOptional({ description: 'new answer' })
  readonly choosen_answer_ids?: string[];
}

// tslint:disable-next-line: max-classes-per-file
export class AnswerSubmitDto {
  @ApiModelProperty({
    required: false,
    type: 'boolean',
    default: false,
    example: false,
  })
  readonly finished: boolean;

  @ApiModelProperty({
    required: true,
    isArray: true,
    example: [
      {
        question_id: uuid.v4(),
        choosen_answer_ids: [uuid.v4()],
      },
    ],
  })
  readonly choosen_answers: AnswerObjectSubmitDto[];
}
