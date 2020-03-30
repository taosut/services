import { ApiModelProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsInstance,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import FederatedIdentityRepresentation from 'keycloak-admin/lib/defs/federatedIdentityRepresentation';
import UserRepresentation from 'keycloak-admin/lib/defs/userRepresentation';
import { AccountCredential } from './accountCredential.type';

export default class FederatedIdentity
  implements FederatedIdentityRepresentation {
  @IsString()
  @ApiModelProperty()
  identityProvider?: string;

  @IsString()
  @ApiModelProperty({ readOnly: true })
  userId?: string;

  @IsString()
  @ApiModelProperty()
  userName?: string;
}

export class Account implements UserRepresentation {
  @ApiModelProperty({ readOnly: true })
  id?: string;

  @IsString()
  @ApiModelProperty()
  username?: string;

  @IsEmail()
  @ApiModelProperty()
  email?: string;

  @IsBoolean()
  @ApiModelProperty({ required: false, default: true })
  enabled?: boolean = true;

  @IsBoolean()
  @ApiModelProperty({ required: false, default: true })
  emailVerified?: boolean = true;

  @IsOptional()
  @IsArray()
  @ApiModelProperty({
    type: AccountCredential,
    isArray: true,
    required: true,
  })
  credentials?: AccountCredential[];

  @IsOptional()
  @IsString()
  @ApiModelProperty()
  firstName?: string;

  @IsOptional()
  @IsString()
  @ApiModelProperty({ required: false })
  lastName?: string;

  @IsOptional()
  @IsInstance(Object)
  @ApiModelProperty({ required: false })
  attributes?: Record<string, any>;

  @IsOptional()
  @IsArray()
  @ApiModelProperty({ required: false })
  federatedIdentities?: FederatedIdentity[];

  federationLink?: string;

  groups?: string[];

  origin?: string;

  realmRoles?: string[];

  self?: string;

  serviceAccountClientId?: string;

  @IsOptional()
  @IsNumber()
  @ApiModelProperty({ required: false, readOnly: true })
  createdTimestamp?: number;
}

export class AccountUpdate extends Account {
  @ApiModelProperty({ readOnly: true })
  username?: string;

  @IsOptional()
  @IsArray()
  @ApiModelProperty({
    type: AccountCredential,
    isArray: true,
    required: false,
  })
  credentials?: AccountCredential[];
}
