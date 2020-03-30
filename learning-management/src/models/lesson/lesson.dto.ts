import { ApiModelProperty } from "@nestjs/swagger";

export class CreateLessonDto {
  @ApiModelProperty({required: false, type: 'string', description: 'Strings must be uuid'})
  readonly id: string;
  @ApiModelProperty({required: true})
  readonly title: string;
  @ApiModelProperty({required: false})
  readonly slug: string;
  @ApiModelProperty({required: false, type: 'enum', enum: ['lecture', 'quiz']})
  readonly lesson_type: string;
  @ApiModelProperty({required: false})
  readonly description: string;
  @ApiModelProperty({required: false})
  readonly duration: number;
  @ApiModelProperty({required: false})
  readonly sort_order: number;
  @ApiModelProperty({required: true, type: 'string', description: 'Strings must be uuid and uuid is available in playlists'})
  readonly playlist_id: string;
}

export class UpdateLessonDto {
  @ApiModelProperty({required: true})
  readonly title: string;
  @ApiModelProperty({required: false})
  readonly slug: string;
  @ApiModelProperty({required: false, type: 'enum', enum: ['lecture', 'quiz'] })
  readonly lesson_type: string;
  @ApiModelProperty({required: false})
  readonly description: string;
  @ApiModelProperty({required: false})
  readonly duration: number;
  @ApiModelProperty({required: false})
  readonly sort_order: number;
  @ApiModelProperty({required: false, type: 'string', description: 'Strings must be uuid and uuid is available in playlists'})
  readonly playlist_id: string;
}


export class ChangeLessonOrder { 
  @ApiModelProperty({required: true})
  readonly sort_order: number|null;
}