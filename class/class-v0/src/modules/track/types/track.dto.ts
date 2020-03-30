import { Class } from '@babel/types';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { Unit } from '../../../modules/unit/unit.entity';

export class TrackDto {
  @IsString()
  @ApiModelProperty()
  title: string;

  @IsString()
  @ApiModelProperty()
  slug?: string;

  @IsString()
  @ApiModelProperty()
  description: string;

  @IsNumber()
  @ApiModelProperty()
  duration?: number;

  @IsArray()
  @ApiModelProperty()
  index_units?: string[];

  units?: Unit[];

  class_id?: string;

  class?: Class;
}
