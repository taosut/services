import { ApiModelProperty } from '@nestjs/swagger';
import { EContentType } from './content.const';

export abstract class IContent {
  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  path: string;

  @ApiModelProperty()
  size: number;

  @ApiModelProperty()
  ownership: string;

  @ApiModelProperty()
  uploadedBy: string;

  @ApiModelProperty()
  realm: string;

  @ApiModelProperty()
  fileType: EContentType;
}

export abstract class IContentResponse {
  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  path: string;

  @ApiModelProperty()
  size: number;

  @ApiModelProperty()
  ownership: string;

  @ApiModelProperty()
  uploadedBy: string;

  @ApiModelProperty()
  realm: string;

  @ApiModelProperty()
  fileType: EContentType;

  @ApiModelProperty()
  generatedSignUrl: ISignedUrlResponse;
}
export interface ISignedUrlResponse {
  ContentType: string;
  filePath: string;
  filename: string;
  url: string;
  securityTokenName: string;
  securityToken: string;
}
export interface IFile {
  buffer: Buffer;
  encoding: string;
  fieldname: string;
  mimetype: string;
  originalname: string;
  size: number;
}
export interface IAWSResponse {
  ETag: Buffer;
  Location: string;
  key: string;
  Bucket: string;
}
export interface IFileResponse {
  fileType: string;
  path: string;
  size: number;
}
