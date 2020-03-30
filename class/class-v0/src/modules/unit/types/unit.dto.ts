import { ApiModelProperty } from '@nestjs/swagger';
import { Unit } from '../unit.entity';

export class UnitDto extends Unit {
  @ApiModelProperty()
  content?: any;

  @ApiModelProperty()
  exam?: any;

  @ApiModelProperty()
  exam_id?: any;
}
