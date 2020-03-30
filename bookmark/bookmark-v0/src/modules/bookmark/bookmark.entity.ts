import { ApiModelProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base-entity';
import { BookmarkDto } from './types/bookmark.dto';

@Entity()
export class Bookmark extends BaseEntity implements BookmarkDto {
  @ApiModelProperty()
  @Column()
  user_id: string;

  @ApiModelProperty()
  @Column()
  class_id: string;

  @ApiModelProperty()
  @Column()
  track_id: string;

  @ApiModelProperty()
  @Column()
  unit_id: string;

  @ApiModelProperty()
  @Column()
  ebook_id: string;
}
