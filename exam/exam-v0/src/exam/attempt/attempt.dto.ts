import { ApiModelProperty } from '@nestjs/swagger';

export class AttemptDto {
  @ApiModelProperty({required: false})
  readonly id?: string;
  @ApiModelProperty({required: true})
  readonly total_attempted: number;
  @ApiModelProperty({required: true})
  readonly total_correct: number;
  @ApiModelProperty({required: true})
  readonly total_question: number;
  @ApiModelProperty({required: true})
  readonly latest_score: string;
  @ApiModelProperty({required: true})
  readonly elapsed_time: number;
  @ApiModelProperty({required: true})
  readonly finished: boolean;
  @ApiModelProperty({required: true})
  readonly latest_started_at: Date;

  @ApiModelProperty({required: true, type: 'string'})
  readonly exam_id: string;
  @ApiModelProperty({required: true, type: 'string'})
  readonly user_id: string;
}

// tslint:disable-next-line: max-classes-per-file
export class AttemptUpdateDto extends AttemptDto {
  @ApiModelProperty({required: true})
  total_attempted: number;
  @ApiModelProperty({required: true})
  total_correct: number;
  @ApiModelProperty({required: true})
  total_question: number;
  @ApiModelProperty({required: true})
  latest_score: string;
  @ApiModelProperty({required: true})
  elapsed_time: number;
  @ApiModelProperty({required: true})
  finished: boolean;
  @ApiModelProperty({type: Date, required: true})
  latest_started_at: Date;
}
