import { CrudDto } from '@magishift/crud';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { Learning } from '../learning/learning.entity';

export class PlaylistDto extends CrudDto {
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
  indexLessons?: string[];

  @IsString()
  @ApiModelProperty()
  learningId?: string;

  @IsString()
  @ApiModelProperty()
  learning?: Learning;

  constructor(partial?: Partial<PlaylistDto>) {
    super();
    Object.assign(this, partial);
  }
}
