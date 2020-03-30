import { ApiModelProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsOptional()
  @IsUUID()
  @ApiModelProperty()
  id?: string = uuid();

  @CreateDateColumn({ nullable: true })
  @ApiModelProperty({ readOnly: true })
  created_at?: Date;

  @UpdateDateColumn({ nullable: true })
  @ApiModelProperty({ readOnly: true })
  updated_at?: Date;
}
