import { ApiModelProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base-entity';
import { EContentType } from './types/content.enum';
import { IContent } from './types/content.type';

@Entity()
export class Content extends BaseEntity implements IContent {
  @ApiModelProperty()
  @Column()
  name: string;

  @ApiModelProperty()
  @Column()
  size: number;

  @ApiModelProperty()
  @Column()
  path: string;

  @ApiModelProperty()
  @Column()
  realm: string;

  @ApiModelProperty()
  @Column()
  ownership: string;

  @ApiModelProperty()
  @Column()
  file_type: EContentType;

  @ApiModelProperty()
  @Column()
  uploaded_by: string;
}
