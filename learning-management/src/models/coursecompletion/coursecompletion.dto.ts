import { ApiModelProperty } from '@nestjs/swagger';

export class CreateCourseCompletionDto {
  @ApiModelProperty({required: false})
  // tslint:disable-next-line: variable-name
  readonly total_progress: string;
  @ApiModelProperty({required: false})
  // tslint:disable-next-line: variable-name
  readonly lecture_progress: string;
  @ApiModelProperty({required: false})
  // tslint:disable-next-line: variable-name
  readonly quiz_progress: string;
  @ApiModelProperty({required: false})
  // tslint:disable-next-line: variable-name
  readonly quiz_score: string;
  @ApiModelProperty({required: false})
  // tslint:disable-next-line: variable-name
  readonly quiz_rank: number;
  @ApiModelProperty({required: false})
  // tslint:disable-next-line: variable-name
  readonly overall_rank: number;
  @ApiModelProperty({type: 'boolean', required: false, example: false})
  readonly finished: boolean;
  @ApiModelProperty({required: true, type: 'string', description: 'Strings must be uuid and uuid is available in courses'})
  // tslint:disable-next-line: variable-name
  readonly course_id: string;
  @ApiModelProperty({required: true, type: 'string', description: 'Strings must be uuid and uuid is available in lesson list'})
  // tslint:disable-next-line: variable-name
  readonly user_id: string;
}

// tslint:disable-next-line: max-classes-per-file
export class UpdateCourseCompletionDto {
  @ApiModelProperty({required: false})
  // tslint:disable-next-line: variable-name
  readonly total_progress: string;
  @ApiModelProperty({required: false})
  // tslint:disable-next-line: variable-name
  readonly lecture_progress: string;
  @ApiModelProperty({required: false})
  // tslint:disable-next-line: variable-name
  readonly quiz_progress: string;
  @ApiModelProperty({required: false})
  // tslint:disable-next-line: variable-name
  readonly quiz_score: string;
  @ApiModelProperty({required: false})
  // tslint:disable-next-line: variable-name
  readonly quiz_rank: number;
  @ApiModelProperty({required: false})
  // tslint:disable-next-line: variable-name
  readonly overall_rank: number;
  @ApiModelProperty({type: 'boolean', required: false, example: false})
  readonly finished: boolean;
}
