import { ApiModelProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiModelProperty({required: true})
  readonly title: string;
  @ApiModelProperty({required: false})
  readonly slug: string;
  // @ApiModelProperty({required: false})
  // readonly preview: string;
  @ApiModelProperty({required: false})
  readonly description: string;
  @ApiModelProperty({required: false})
// tslint:disable-next-line: variable-name
  readonly term_and_condition: string;
  @ApiModelProperty({required: true, type: 'string', description: 'Strings must be uuid and uuid is available in track list'})
  // tslint:disable-next-line: variable-name
  readonly track_id: string;
}

// tslint:disable-next-line: max-classes-per-file
export class UpdateCourseDto {
  @ApiModelProperty({required: true})
  readonly title: string;
  @ApiModelProperty({required: false})
  readonly slug: string;
  // @ApiModelProperty({required: false})
  // readonly preview: string;
  @ApiModelProperty({required: false})
  readonly description: string;
  @ApiModelProperty({required: false})
  // tslint:disable-next-line: variable-name
  readonly term_and_condition: string;
  @ApiModelProperty({required: false, type: 'string', description: 'Strings must be uuid and uuid is available in track list'})
  // tslint:disable-next-line: variable-name
  readonly track_id: number;
}

// tslint:disable-next-line: max-classes-per-file
export class ChangeCourseOrder {
  @ApiModelProperty({required: true})
// tslint:disable-next-line: variable-name
  readonly sort_order: number|null;
}

// tslint:disable-next-line: max-classes-per-file
export class UpdateApprovalDto {
  @ApiModelProperty({required: true})
  readonly approved: boolean;
}

// tslint:disable-next-line: max-classes-per-file
export class UpdatePublicationDto {
  @ApiModelProperty({required: true})
  readonly published: boolean;
}

// tslint:disable-next-line: max-classes-per-file
export class UpdateCourseImageDto {
  @ApiModelProperty({required: true})
  readonly preview: string;
}
