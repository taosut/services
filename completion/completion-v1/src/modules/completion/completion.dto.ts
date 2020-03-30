import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

import {
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateCompletionDto {
  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @IsNumber()
  elapsed_time?: number;

  @ApiModelProperty()
  @IsNumberString({ always: true })
  @MaxLength(20, { always: true })
  progress: string;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  finished?: boolean;

  @ApiModelProperty()
  @IsString({ always: true })
  class_id: string;

  @ApiModelProperty()
  @IsString({ always: true })
  track_id: string;

  @ApiModelProperty()
  @IsString({ always: true })
  unit_id: string;
}

export class NextCompletionDto {
  @ApiModelProperty()
  @IsString({ always: true })
  class_id: string;
}

export class NextCompletionResponseDto {
  @ApiModelProperty()
  readonly track: any;

  @ApiModelProperty()
  readonly next_unit: any;
}
