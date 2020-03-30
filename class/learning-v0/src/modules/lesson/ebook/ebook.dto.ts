import { ApiModelProperty } from '@nestjs/swagger';
import { Lesson } from '../lesson.entity';

export abstract class EbookDto {
  id?: string;

  @ApiModelProperty()
  title: string;

  @ApiModelProperty()
  content: string;

  @ApiModelProperty()
  pageNumber: number;

  @ApiModelProperty()
  lessonId?: string;

  lesson?: Lesson;
}
