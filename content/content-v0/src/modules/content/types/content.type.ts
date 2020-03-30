import { ApiModelProperty } from '@nestjs/swagger';
import { EContentType } from './content.enum';

export abstract class IContent {
  name: string;
  path: string;
  size: number;
  ownership: string;
  realm: string;
  uploaded_by: string;
  file_type: EContentType;
}

export class SignedUrlResponse {
  @ApiModelProperty()
  type?: string;

  @ApiModelProperty()
  path?: string;

  @ApiModelProperty()
  name?: string;

  @ApiModelProperty()
  url: string;

  @ApiModelProperty()
  token_name: string;

  @ApiModelProperty()
  token: string;
}

export abstract class IContentResponse implements IContent {
  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  path: string;

  @ApiModelProperty()
  size: number;

  @ApiModelProperty()
  ownership: string;

  @ApiModelProperty()
  uploaded_by: string;

  @ApiModelProperty()
  realm: string;

  @ApiModelProperty()
  file_type: EContentType;

  @ApiModelProperty()
  generated_sign_url: SignedUrlResponse;
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
