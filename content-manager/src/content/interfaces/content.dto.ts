import { ApiModelProperty } from '@nestjs/swagger';
import { EContentType } from './content.const';

export abstract class ContentDto {
  id?: string;

  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  ownership: string;

  @ApiModelProperty()
  uploadedBy: string;

  @ApiModelProperty()
  realm: string;

  @ApiModelProperty({ default: null })
  path: string;

  @ApiModelProperty({ default: 0 })
  size: number;

  @ApiModelProperty({
    description: `Available type : [${EContentType.video}, ${
      EContentType.audio
    }, ${EContentType.image}, ${EContentType.pdf}, ${EContentType.doc}, ${
      EContentType.docx
    }]`,
  })
  fileType: EContentType;
}
