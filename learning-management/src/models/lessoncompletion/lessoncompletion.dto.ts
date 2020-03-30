import { ApiModelProperty } from '@nestjs/swagger';

export class CreateLessonCompletionDto {
  @ApiModelProperty({required: true})
  // tslint:disable-next-line: variable-name
  readonly elapsed_time: number;
  @ApiModelProperty({required: true})
  readonly progress: string;
  @ApiModelProperty({type: 'boolean', required: false, example: false})
  readonly finished: boolean;
}

// tslint:disable-next-line: max-classes-per-file
export class UpdateLessonCompletionDto {
  @ApiModelProperty({required: true})
  // tslint:disable-next-line: variable-name
  readonly elapsed_time: number;
  @ApiModelProperty({required: true})
  readonly progress: string;
  @ApiModelProperty({type: 'boolean', required: false, example: false})
  readonly finished: boolean;
  @ApiModelProperty({required: true, type: 'string', description: 'Strings must be uuid and uuid is available in lesson list'})
  // tslint:disable-next-line: variable-name
  readonly lesson_id: string;
}
