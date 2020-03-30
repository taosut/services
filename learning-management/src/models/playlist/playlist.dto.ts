import { ApiModelProperty } from '@nestjs/swagger';

export class CreatePlaylistDto {
  @ApiModelProperty({required: true})
  readonly title: string;
  @ApiModelProperty({required: false})
  readonly slug: string;
  @ApiModelProperty({required: false})
  readonly description: string;
  @ApiModelProperty({required: false})
  readonly duration: number;
  @ApiModelProperty({required: true, type: 'string', description: 'Strings must be uuid and uuid is available in course list'})
// tslint:disable-next-line: variable-name
  readonly course_id: string;
}

// tslint:disable-next-line: max-classes-per-file
export class UpdatePlaylistDto {
  @ApiModelProperty({required: true})
  readonly title: string;
  @ApiModelProperty({required: false})
  readonly slug: string;
  @ApiModelProperty({required: false})
  readonly description: string;
  @ApiModelProperty({required: false})
  readonly duration: number;
  @ApiModelProperty({required: false, type: 'string', description: 'Strings must be uuid and uuid is available in course list'})
// tslint:disable-next-line: variable-name
  readonly course_id: string;
}

// tslint:disable-next-line: max-classes-per-file
export class ChangePlaylistOrder {
  @ApiModelProperty({required: true})
// tslint:disable-next-line: variable-name
  readonly sort_order: number|null;
}
