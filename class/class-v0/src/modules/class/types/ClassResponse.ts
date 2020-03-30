import { Injectable } from '@nestjs/common';
import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { Class } from '../class.entity';
import { ClassInfoDto } from './classInfo.dto';
@Injectable()
export class ClassResponse extends Class {
  @ApiModelPropertyOptional()
  featured_file?: string;

  @ApiModelPropertyOptional()
  preview_file?: string;

  @ApiModelPropertyOptional()
  info?: ClassInfoDto;
}
