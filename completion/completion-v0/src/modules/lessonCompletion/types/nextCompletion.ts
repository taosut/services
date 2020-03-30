import { ApiModelProperty } from '@nestjs/swagger';

export class NextCompletionDto {
  @ApiModelProperty()
  readonly user_id: string;

  @ApiModelProperty()
  readonly learning_id: string;
}

export class NextCompletionResponse {
  @ApiModelProperty()
  readonly lesson: any;
  @ApiModelProperty()
  readonly targetPlaylist: any;
}
