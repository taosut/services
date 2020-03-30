import { ApiModelProperty } from '@nestjs/swagger';
import { Unit } from '../unit.entity';

export abstract class EbookDto {
  id?: string;

  @ApiModelProperty()
  title: string;

  @ApiModelProperty()
  content: string;

  @ApiModelProperty()
  page_number: number;

  @ApiModelProperty()
  unit_id?: string;

  unit?: Unit;
}
