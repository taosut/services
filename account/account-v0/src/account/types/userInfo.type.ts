import { ApiModelProperty } from '@nestjs/swagger';

export abstract class UserInfo {
  @ApiModelProperty()
  sub: string;

  @ApiModelProperty()
  email_verified: boolean;

  @ApiModelProperty()
  preferred_username: string;
}
