import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsJSON, IsOptional, IsString } from 'class-validator';
import { BeforeInsert, Column, Entity } from 'typeorm';
import uuid = require('uuid');
import { BaseEntity } from './baseEntity';

const sampleClass = {
  id: 'class_id',
  title: 'MY CLASS',
};
const sampleUser = {
  id: 'user_id',
  firstName: 'USER',
};
const sampleCompletion = {
  id: 'completion_id',
  finished: true,
  completed_at: new Date(),
};
@Entity('certificates')
export class Certificate extends BaseEntity {
  @ApiModelProperty({ example: sampleUser })
  @IsJSON()
  @Column({ type: 'json' })
  user: any;

  @ApiModelProperty({ example: sampleClass })
  @IsJSON()
  @Column({ type: 'json' })
  class: any;

  @ApiModelProperty({ example: sampleCompletion })
  @IsJSON()
  @Column({ type: 'json' })
  completion: any;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @IsString({ always: true })
  @Column({ nullable: true })
  url: string;

  @BeforeInsert()
  protected beforeInsert(): void {
    this.id = uuid.v4();
  }
}
