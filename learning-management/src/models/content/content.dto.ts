import { ApiModelProperty } from '@nestjs/swagger';
import { ContentAttachment } from '../contentattachment/contentattachment.entity';

export class CreateContentDto {
  @ApiModelProperty({required: false, type: 'string', description: 'Strings must be uuid'})
  readonly id: string;
  @ApiModelProperty({required: false})
  readonly content: string|null;
  @ApiModelProperty({required: false})
// tslint:disable-next-line: variable-name
  readonly video_source: string;
  @ApiModelProperty({required: false})
// tslint:disable-next-line: variable-name
  readonly video_link: string;
  @ApiModelProperty({required: false})
  readonly duration: number|null;

  @ApiModelProperty({required: false, type: [ContentAttachment], isArray: true})
// tslint:disable-next-line: variable-name
  readonly content_attachments: ContentAttachment[];
}

// tslint:disable-next-line: max-classes-per-file
export class UpdateContentDto {
  @ApiModelProperty({required: false})
  readonly content: string;
  @ApiModelProperty({required: false})
// tslint:disable-next-line: variable-name
  readonly video_source: string;
  @ApiModelProperty({required: false})
// tslint:disable-next-line: variable-name
  readonly video_link: string;

  @ApiModelProperty({required: false, type: [ContentAttachment], isArray: true})
// tslint:disable-next-line: variable-name
  readonly content_attachments: ContentAttachment[];
}
