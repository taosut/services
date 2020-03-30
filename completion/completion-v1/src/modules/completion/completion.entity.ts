import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import {
  IsJSON,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import uuid = require('uuid');
import { BaseEntity } from '../base-entity';
import { MetaCompletionDto } from './types/meta.dto';
import { EUnitType } from './types/unitType.enum';

@Entity('completions')
export class Completion extends BaseEntity {
  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @IsNumber()
  @Column({ type: 'int', default: 0 })
  elapsed_time: number;

  @ApiModelProperty({
    description: `Available Types: [ ${Object.values(EUnitType).join(', ')} ]`,
  })
  @IsString({ always: true })
  @MaxLength(20, { always: true })
  @Column({ length: 20 })
  type: string;

  @ApiModelProperty()
  @IsNumberString({ always: true })
  @MaxLength(20, { always: true })
  @Column({ length: 20, type: 'varchar' })
  progress: string;

  @ApiModelProperty()
  @IsOptional()
  @IsNumberString({ always: true })
  @MaxLength(20, { always: true })
  @Column({ length: 20, type: 'varchar', nullable: true })
  score?: string;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @Column({ default: false })
  finished?: boolean;

  @ApiModelProperty()
  @IsOptional({ always: true })
  @Column({ type: 'varchar' })
  user_id: string;

  @ApiModelProperty()
  @IsString({ always: true })
  @Column({ type: 'varchar' })
  class_id: string;

  @ApiModelProperty()
  @IsString({ always: true })
  @Column({ type: 'varchar' })
  track_id: string;

  @ApiModelPropertyOptional()
  @Column({ type: 'varchar' })
  unit_id: string;

  @ApiModelProperty()
  @IsOptional()
  @IsJSON()
  @Column({ type: 'json', nullable: true })
  meta: MetaCompletionDto;

  @BeforeInsert()
  protected beforeInsert(): void {
    this.id = uuid.v4();
  }

  @BeforeInsert()
  @BeforeUpdate()
  protected validateProgress(): void {
    if (Number(this.progress) >= 100) {
      this.finished = true;
      this.progress = '100';
    } else {
      this.finished = false;
    }
  }
}
