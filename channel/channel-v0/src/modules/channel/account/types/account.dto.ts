import { Injectable } from '@nestjs/common';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

@Injectable()
export class CreateAccountDto {
  @ApiModelProperty()
  @IsString()
  username: string;

  @ApiModelProperty()
  @IsString()
  email: string;

  @ApiModelProperty()
  @IsBoolean()
  enabled: boolean;

  @ApiModelProperty()
  @IsBoolean()
  emailVerified: boolean;

  @ApiModelProperty()
  credentials: [
    {
      type: 'password';
      value: string;
    },
  ];

  @ApiModelProperty()
  @IsString()
  firstName: string;

  @ApiModelProperty()
  @IsString()
  lastName: string;

  @ApiModelPropertyOptional()
  attributes?: any;

  @ApiModelPropertyOptional()
  federatedIdentities?: [string];
}

export class CreateChannelAccountDto {
  @ApiModelProperty()
  @IsString()
  channel_id: string;

  @ApiModelProperty()
  @IsString()
  account_id: string;
}
