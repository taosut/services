import { ApiModelProperty } from '@nestjs/swagger';
import { EContentType } from './content.enum';
import { IContent, SignedUrlResponse } from './content.type';

export abstract class ContentDto implements IContent {
  id?: string;

  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  ownership: string;

  @ApiModelProperty()
  uploaded_by: string;

  @ApiModelProperty()
  realm: string;

  @ApiModelProperty({ default: null })
  path: string;

  @ApiModelProperty({ default: 0 })
  size: number;

  @ApiModelProperty({
    description: `Available type : [${EContentType.mp4}, ${EContentType.mp3}, ${EContentType.png}, ${EContentType.pdf}, ${EContentType.doc}, ${EContentType.docx}]`,
  })
  file_type: EContentType;
}

export abstract class ContentResponse implements IContent {
  id?: string;

  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  size: number;

  @ApiModelProperty()
  path: string;

  @ApiModelProperty()
  realm: string;

  @ApiModelProperty()
  ownership: string;

  @ApiModelProperty()
  uploaded_by: string;

  @ApiModelProperty()
  file_type: EContentType;

  @ApiModelProperty()
  url: string;

  @ApiModelProperty()
  generated_sign_url: SignedUrlResponse;
}
