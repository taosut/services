import { ApiModelProperty } from '@nestjs/swagger';

export class KeycloakMainConfig {
  @ApiModelProperty()
  realm_main: string;

  @ApiModelProperty()
  user_main: string;

  @ApiModelProperty()
  password_main: string;

  @ApiModelProperty()
  client_main: string;

  @ApiModelProperty()
  baseUrl: string;

  @ApiModelProperty()
  grant_type: string;
}
