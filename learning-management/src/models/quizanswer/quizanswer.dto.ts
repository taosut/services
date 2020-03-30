import { ApiModelProperty } from "@nestjs/swagger";

export class CreateQuizAnswerDto {
  @ApiModelProperty({required: false, type: 'string', description: 'Strings must be uuid'})
  readonly id: string;
  @ApiModelProperty({required: true})
  readonly answer: string;
  @ApiModelProperty({required: true})
  readonly correct: boolean;
  @ApiModelProperty({required: true, type: 'string', description: 'Strings must be uuid and uuid is available in playlists'})
  readonly question_id: string;
}

export class UpdateQuizAnswerDto {
  @ApiModelProperty({required: true})
  readonly answer: string;
  @ApiModelProperty({required: true})
  readonly correct: boolean;
  @ApiModelProperty({required: true, type: 'string', description: 'Strings must be uuid and uuid is available in playlists'})
  readonly question_id: string;
}