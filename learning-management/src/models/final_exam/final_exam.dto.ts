import { ApiModelProperty } from '@nestjs/swagger';

export class CreateFinalExamDto {
  @ApiModelProperty({required: true})
  readonly title: string;
  @ApiModelProperty({required: false})
  readonly slug: string;
  @ApiModelProperty({required: false})
  readonly description: string;
  @ApiModelProperty({required: false, example: 0})
  readonly duration: number;
  @ApiModelProperty({required: false, example: false})
  readonly published: boolean;
  @ApiModelProperty({required: false, type: 'string', description: 'Strings must be uuid and uuid is available in tracks', example: null})
  // tslint:disable-next-line: variable-name
  readonly track_id: string|null;
  @ApiModelProperty({required: false, type: 'string', description: 'Strings must be uuid and uuid is available in courses', example: null})
  // tslint:disable-next-line: variable-name
  readonly course_id: string|null;
  @ApiModelProperty({required: false, type: 'string', description: 'Strings must be uuid and uuid is available in playlists', example: null})
  // tslint:disable-next-line: variable-name
  readonly playlist_id: string|null;
}

// tslint:disable-next-line: max-classes-per-file
export class UpdateFinalExamDto {
  @ApiModelProperty({required: true})
  readonly title: string;
  @ApiModelProperty({required: false})
  readonly slug: string;
  @ApiModelProperty({required: false})
  readonly description: string;
  @ApiModelProperty({required: false, example: 0})
  readonly duration: number;
  @ApiModelProperty({required: false, example: false})
  readonly published: boolean;
  @ApiModelProperty({required: false, type: 'string', description: 'Strings must be uuid and uuid is available in tracks', example: null})
  // tslint:disable-next-line: variable-name
  readonly track_id: string|null;
  @ApiModelProperty({required: false, type: 'string', description: 'Strings must be uuid and uuid is available in courses', example: null})
  // tslint:disable-next-line: variable-name
  readonly course_id: string|null;
  @ApiModelProperty({required: false, type: 'string', description: 'Strings must be uuid and uuid is available in playlists', example: null})
  // tslint:disable-next-line: variable-name
  readonly playlist_id: string|null;
}
