import { ApiModelProperty } from '@nestjs/swagger';

export abstract class TokenPayload {
  @ApiModelProperty()
  readonly email: string;

  @ApiModelProperty()
  readonly email_verified: boolean;

  @ApiModelProperty()
  readonly exp: number;

  @ApiModelProperty()
  readonly family_name: string;

  @ApiModelProperty()
  readonly given_name: string;

  @ApiModelProperty()
  readonly name: string;

  @ApiModelProperty()
  readonly nonce: string;

  @ApiModelProperty()
  readonly preferred_username: string;

  @ApiModelProperty()
  readonly realm_access: { roles: string[] };

  @ApiModelProperty()
  readonly resource_access: object;

  @ApiModelProperty()
  readonly scope: string;

  /**
   * Session Id
   *
   * @type {string}
   * @memberof ITokenPayload
   */
  @ApiModelProperty()
  readonly session_state: string;

  /**
   * Account Id
   *
   * @type {string}
   * @memberof ITokenPayload
   */
  @ApiModelProperty()
  readonly sub: string;

  @ApiModelProperty()
  readonly typ: string;

  @ApiModelProperty()
  readonly azp: string;
}
