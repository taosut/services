import { ApiModelProperty } from '@nestjs/swagger';

export abstract class LoginPayload {
  @ApiModelProperty()
  username: string;

  @ApiModelProperty()
  password: string;
}
