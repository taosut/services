import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base-entity';

@Entity()
export class TrackCompletion extends BaseEntity {
  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @IsNumber()
  @Column({ type: 'int', default: 0 })
  elapsed_time: number;

  @ApiModelProperty()
  @IsNumberString({ always: true })
  @MaxLength(20, { always: true })
  @Column({ length: 20, type: 'varchar' })
  progress: string;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @Column({ default: false })
  finished: boolean;

  @ApiModelProperty()
  @IsOptional({ always: true })
  @Column({ type: 'varchar', nullable: true })
  user_id: string;

  @ApiModelProperty()
  @IsString({ always: true })
  @Column({ type: 'varchar' })
  track_id: string;
}
