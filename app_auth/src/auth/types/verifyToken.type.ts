import { ApiModelProperty } from '@nestjs/swagger';

export abstract class VerifyTokenPayload {
  @ApiModelProperty()
  token: string;
}
