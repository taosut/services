import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ClassInfoDto {
  @ApiModelProperty()
  @IsString()
  track: number = 0;

  @ApiModelProperty()
  @IsString()
  video: number = 0;

  @ApiModelProperty()
  @IsString()
  audio: number = 0;

  @ApiModelProperty()
  @IsString()
  ebook: number = 0;

  @ApiModelProperty()
  @IsString()
  exam: number = 0;
}
