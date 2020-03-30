import { ApiModelProperty } from '@nestjs/swagger';
import { Unit } from '../unit.entity';

export abstract class AudioTrackDto {
  id?: string;

  @ApiModelProperty()
  title: string;

  @ApiModelProperty()
  time: string;

  @ApiModelProperty()
  minute: string;

  @ApiModelProperty()
  second: string;

  @ApiModelProperty()
  unit_id?: string;

  unit?: Unit;
}
