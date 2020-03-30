import { ApiModelProperty } from '@nestjs/swagger';
import { Lesson } from '../lesson.entity';

export abstract class AudioPlaylistDto {
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
  lessonId?: string;

  lesson?: Lesson;
}
