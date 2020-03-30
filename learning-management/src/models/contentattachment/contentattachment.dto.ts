import { ApiModelProperty } from "@nestjs/swagger";

export class CreateContentAttachmentDto {
  @ApiModelProperty({required: false, type: 'string', description: 'Strings must be uuid'})
  readonly id: string;
  @ApiModelProperty({required: false})
  readonly name: string;
  @ApiModelProperty({required: false})
  readonly type: string;
  @ApiModelProperty({required: false})
  readonly size: number;
  @ApiModelProperty({required: false, type: 'string', description: 'Strings must be uuid'})
  readonly content_id: string;
  @ApiModelProperty({required: false})
  readonly path: string;
}

export class UpdateContentAttachmentDto {
  @ApiModelProperty({required: false})
  readonly name: string;
  @ApiModelProperty({required: false})
  readonly type: string;
  @ApiModelProperty({required: false})
  readonly size: number;
  @ApiModelProperty({required: false})
  readonly path: string;
}