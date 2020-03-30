import { ApiModelProperty } from '@nestjs/swagger';

export class CreateTrackDto {
  @ApiModelProperty({required: true})
  readonly title: string;
  @ApiModelProperty({required: false})
  readonly slug: string;
  @ApiModelProperty({required: false})
  readonly preview: string;
  @ApiModelProperty({required: false})
  readonly description: string;
  @ApiModelProperty({required: false})
  readonly requirement: string;
  @ApiModelProperty({required: false})
  readonly published: boolean;
  @ApiModelProperty({required: false, type: 'string', description: 'Strings must be uuid'})
// tslint:disable-next-line: variable-name
  readonly user_id: string|null;
}

// tslint:disable-next-line: max-classes-per-file
export class UpdateTrackDto {
  @ApiModelProperty({required: true})
  readonly title: string;
  @ApiModelProperty({required: false})
  readonly slug: string;
  @ApiModelProperty({required: false})
  readonly preview: string;
  @ApiModelProperty({required: false})
  readonly description: string;
  @ApiModelProperty({required: false})
  readonly requirement: string;
  @ApiModelProperty({required: false})
  readonly published: boolean;
  @ApiModelProperty({required: false})
// tslint:disable-next-line: variable-name
  readonly sort_order: number;
  @ApiModelProperty({required: false, type: 'string'})
// tslint:disable-next-line: variable-name
  readonly user_id: string|null;
}

// tslint:disable-next-line: max-classes-per-file
export class AddTrackCourseDto {
  @ApiModelProperty({required: false})
  readonly courses: ReadonlyArray<string>|null;
}

// tslint:disable-next-line: max-classes-per-file
export class ChangeTrackOrder {
  @ApiModelProperty({required: true})
  readonly sort_order: number|null;
}

// tslint:disable-next-line: max-classes-per-file
export class UpdateTrackImageDto {
  @ApiModelProperty({required: true})
  readonly preview: string;
}
