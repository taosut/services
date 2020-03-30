import { Injectable } from '@nestjs/common';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

@Injectable()
export class ContactDto {
  @ApiModelProperty()
  @IsString()
  name: string;

  @ApiModelProperty()
  @IsString()
  url: string;
}

@Injectable()
export class MetaDto {
  @ApiModelPropertyOptional()
  @IsArray()
  contacts: ContactDto[];
}
