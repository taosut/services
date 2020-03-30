import { ApiModelProperty } from '@nestjs/swagger';

export class LessonCompletionDto {
  @ApiModelProperty()
  readonly elapsed_time: number;

  @ApiModelProperty()
  readonly progress: string;

  @ApiModelProperty()
  readonly user_id: string;

  @ApiModelProperty()
  readonly playlist_id: string;

  @ApiModelProperty()
  readonly learning_id: string;

  @ApiModelProperty()
  readonly lesson_id: string;
}

export class LessonCompletionUpdateDto {
  @ApiModelProperty()
  readonly elapsed_time: number;

  @ApiModelProperty()
  readonly progress: string;
}
