import { ApiModelProperty } from '@nestjs/swagger';

export abstract class IUserLoginPayload {
  @ApiModelProperty({ required: false })
  readonly username?: string;

  @ApiModelProperty({ required: false })
  readonly email?: string;

  @ApiModelProperty()
  readonly password: string;
}
