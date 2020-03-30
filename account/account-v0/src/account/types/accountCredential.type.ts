import { ApiModelProperty } from '@nestjs/swagger';
import CredentialRepresentation from 'keycloak-admin/lib/defs/credentialRepresentation';

export class AccountCredential implements CredentialRepresentation {
  algorithm?: string;

  config?: Record<string, any>;

  counter?: number;

  createdDate?: number;

  device?: string;

  digits?: number;

  hashIterations?: number;

  hashedSaltedValue?: string;

  period?: number;

  salt?: string;

  temporary?: boolean = false;

  @ApiModelProperty({ type: String, default: 'password', example: 'password' })
  type?: string = 'password';

  @ApiModelProperty()
  value?: string;
}
