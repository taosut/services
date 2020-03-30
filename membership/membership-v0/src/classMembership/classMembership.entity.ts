import { ApiModelProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { BeforeInsert, Column, Entity } from 'typeorm';
import uuid = require('uuid');
import { BaseEntity } from './baseEntity';

@Entity('class_members')
export class ClassMembership extends BaseEntity {
  @ApiModelProperty({ type: 'string', example: 'CLASS_ID' })
  @IsNotEmpty({ always: true })
  @Column()
  class_id: string;

  @ApiModelProperty({ type: 'string', example: 'USER_ID' })
  @IsNotEmpty({ always: true })
  @Column()
  user_id: string;

  @ApiModelProperty({ type: 'boolean', example: false })
  @IsOptional({ always: true })
  @IsBoolean({ always: true })
  @Column({ type: 'boolean', default: false })
  has_joined: boolean;

  @ApiModelProperty({ example: null })
  @IsOptional({ always: true })
  @Column({ nullable: true })
  start?: Date | null;

  @ApiModelProperty({ example: null })
  @IsOptional({ always: true })
  @Column({ nullable: true })
  expired?: Date | null;

  @BeforeInsert()
  protected beforeInsert(): void {
    this.id = uuid.v4();
  }
}
