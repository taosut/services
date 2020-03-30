import { CrudDto } from '@magishift/crud';
import { ApiModelProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { Playlist } from '../playlist/playlist.entity';
import { ELearningType } from './learning.const';

export class LearningDto extends CrudDto {
  @IsString()
  @ApiModelProperty()
  title: string;

  @IsString()
  @ApiModelProperty()
  slug?: string;

  @IsString()
  @ApiModelProperty()
  description: string;

  @IsString()
  @ApiModelProperty()
  termAndCondition: string;

  @IsString()
  @ApiModelProperty({ default: false })
  published: boolean;

  @IsBoolean()
  @ApiModelProperty({ default: false })
  approved: boolean;

  @IsBoolean()
  @ApiModelProperty({ default: false })
  premium: boolean;

  @IsString()
  @ApiModelProperty()
  featuredFileId: string;

  @IsString()
  @ApiModelProperty()
  previewFileId: string;

  @IsString()
  @ApiModelProperty()
  userId: string;

  @IsString()
  @ApiModelProperty()
  trackId: string;

  @IsString()
  @ApiModelProperty()
  subCategoryId: string;

  @IsString()
  @ApiModelProperty()
  publisherId: string;

  @IsNumber()
  @ApiModelProperty()
  enrolledNumber: number;

  @IsEnum(ELearningType.video)
  @ApiModelProperty()
  type: ELearningType;

  @ApiModelProperty()
  length: string;

  @ApiModelProperty()
  effort: string;

  @IsOptional()
  @IsArray()
  indexPlaylists?: string[];

  @IsOptional()
  @IsArray()
  syllabus: string[];

  @IsOptional()
  @IsArray()
  playlists?: Playlist[];

  constructor(partial?: Partial<LearningDto>) {
    super();
    Object.assign(this, partial);
  }
}
