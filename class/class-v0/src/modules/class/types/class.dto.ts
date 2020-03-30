import { Injectable } from '@nestjs/common';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Track } from '../../../modules/track/track.entity';
import { Class } from '../class.entity';
import { EClassType } from './class.enum';
import { ClassInfoDto } from './classInfo.dto';
import { MetaDto } from './meta.dto';

@Injectable()
export class ClassDto {
  title: string;
  slug?: string;
  description: string;
  term_and_condition: string;
  published: boolean;
  approved: boolean;
  premium: boolean;
  featured: boolean;
  featured_file_id?: string;
  preview_file_id?: string;
  user_id?: string;
  publisher_id: string;
  enrolled: number;
  type: EClassType;
  length: string;
  effort: string;
  meta?: MetaDto;
  index_tracks?: string[];
  syllabus?: string[];
  tracks?: Track[];

  id?: string;
  created_at?: Date;
  updated_at?: Date;
  @ApiModelProperty({
    nullable: true,
  })
  @IsOptional()
  info?: ClassInfoDto;
}

export class FindByMetaDto {
  @ApiModelPropertyOptional({
    description: 'category names separate by (,)',
  })
  categories?: string;

  @ApiModelPropertyOptional({
    description: 'sub category names separate by (,)',
  })
  sub_categories?: string;

  @ApiModelPropertyOptional({
    description: 'series names separate by (,)',
  })
  series?: string;

  @ApiModelPropertyOptional()
  filter?: string;
}
export class MyClassDto {
  @ApiModelProperty()
  id: string;

  @ApiModelProperty()
  created_at: string;

  @ApiModelProperty()
  updated_at: string;

  @ApiModelProperty()
  user_id: string;

  @ApiModelProperty()
  has_joined: boolean;

  @ApiModelProperty()
  start: string;

  @ApiModelProperty()
  expired: string;

  @ApiModelProperty()
  class_id: string;

  @ApiModelProperty()
  class: Class;
}
