import { ApiModelProperty } from '@nestjs/swagger';

export class PlaylistCompletionDto {
  @ApiModelProperty()
  readonly elapsed_time: number;

  @ApiModelProperty()
  readonly progress: string;

  @ApiModelProperty()
  readonly lecture_progress: string;

  @ApiModelProperty()
  readonly quiz_progress: string;

  @ApiModelProperty()
  readonly quiz_score: string;

  @ApiModelProperty()
  readonly quiz_rank: string;

  @ApiModelProperty()
  readonly overall_rank: string;

  @ApiModelProperty()
  readonly user_id: string;

  @ApiModelProperty()
  readonly playlist_id: string;

  @ApiModelProperty()
  readonly learning_id: string;
}

export class PlaylistCompletionUpdateDto {
  @ApiModelProperty()
  readonly elapsed_time?: number;

  @ApiModelProperty()
  readonly progress: string;

  @ApiModelProperty()
  readonly lecture_progress?: string;

  @ApiModelProperty()
  readonly quiz_progress?: string;

  @ApiModelProperty()
  readonly quiz_score?: string;

  @ApiModelProperty()
  readonly quiz_rank?: string;

  @ApiModelProperty()
  readonly overall_rank?: string;
}
