import { Injectable } from '@nestjs/common';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { MetaDto } from './meta.dto';

@Injectable()
export class CreateChannelDto {
  @ApiModelProperty()
  @IsString()
  name: string;

  @ApiModelProperty()
  @IsString()
  description: string;

  @ApiModelProperty()
  @IsString()
  sort_description: string;

  @ApiModelPropertyOptional({
    example: { contacts: [{ name: '<string>', url: '<string>' }] },
  })
  meta: MetaDto;

  @ApiModelProperty()
  @IsString()
  username: string;

  @ApiModelProperty()
  @IsString()
  password: string;

  @ApiModelProperty()
  @IsString()
  email: string;

  @ApiModelProperty()
  @IsString()
  enabled: boolean = true;

  @ApiModelProperty()
  @IsString()
  emailVerified: boolean = true;
}
