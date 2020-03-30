import { ApiModelProperty } from '@nestjs/swagger';

export class CreateQuizAttemptDto {
  @ApiModelProperty({required: false, type: 'string', description: 'Strings must be uuid'})
  readonly id: string;
  @ApiModelProperty({required: true})
  // tslint:disable-next-line: variable-name
  readonly total_attempted: number;
  @ApiModelProperty({required: true})
  // tslint:disable-next-line: variable-name
  readonly total_correct: number;
  @ApiModelProperty({required: true})
  // tslint:disable-next-line: variable-name
  readonly total_question: number;
  @ApiModelProperty({required: true})
  // tslint:disable-next-line: variable-name
  readonly latest_score: string;
  @ApiModelProperty({required: true})
  // tslint:disable-next-line: variable-name
  readonly elapsed_time: number;
  @ApiModelProperty({required: true})
  // tslint:disable-next-line: variable-name
  readonly finished: boolean;
  @ApiModelProperty({required: true})
  // tslint:disable-next-line: variable-name
  readonly latest_started_at: Date;

  @ApiModelProperty({required: true, type: 'string', description: 'Strings must be uuid and uuid is available in lesson list'})
  // tslint:disable-next-line: variable-name
  readonly quiz_id: string;
  @ApiModelProperty({required: true, type: 'string', description: 'Strings must be uuid'})
  // tslint:disable-next-line: variable-name
  readonly user_id: string;
}

// tslint:disable-next-line: max-classes-per-file
export class UpdateQuizAttemptDto {
  @ApiModelProperty({required: true})
// tslint:disable-next-line: variable-name
  readonly total_attempted: number;
  @ApiModelProperty({required: true})
  // tslint:disable-next-line: variable-name
  readonly total_correct: number;
  @ApiModelProperty({required: true})
  // tslint:disable-next-line: variable-name
  readonly total_question: number;
  @ApiModelProperty({required: true})
  // tslint:disable-next-line: variable-name
  readonly latest_score: string;
  @ApiModelProperty({required: true})
  // tslint:disable-next-line: variable-name
  readonly elapsed_time: number;
  @ApiModelProperty({required: true})
  // tslint:disable-next-line: variable-name
  readonly finished: boolean;
  @ApiModelProperty({type: Date, required: true})
  // tslint:disable-next-line: variable-name
  readonly latest_started_at: Date;
}
