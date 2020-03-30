import { ApiModelProperty } from '@nestjs/swagger';

export abstract class RefreshTokenPayload {
  @ApiModelProperty()
  refreshToken: string;
}
