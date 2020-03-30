import { ApiModelProperty } from '@nestjs/swagger';
export class FileMeta {
  @ApiModelProperty()
  type: string;

  @ApiModelProperty()
  originalname: string;
}
