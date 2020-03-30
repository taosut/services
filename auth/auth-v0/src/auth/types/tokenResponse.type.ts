import { ApiModelProperty } from '@nestjs/swagger';

export abstract class ITokenResponse {
  @ApiModelProperty()
  access_token: string;

  @ApiModelProperty()
  expires_in: string;

  @ApiModelProperty()
  refresh_expires_in: number;

  @ApiModelProperty()
  refresh_token: string;

  @ApiModelProperty()
  token_type: string;

  @ApiModelProperty()
  not_before_policy: number;

  @ApiModelProperty()
  session_state: string;

  @ApiModelProperty()
  scope: string;
}
