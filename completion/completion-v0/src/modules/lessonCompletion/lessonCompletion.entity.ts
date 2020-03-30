import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { BaseEntity } from '../base-entity';

@Entity()
export class LessonCompletion extends BaseEntity {
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
  @Column({ type: 'varchar' })
  user_id: string;

  @ApiModelProperty()
  @IsString({ always: true })
  @Column({ type: 'varchar' })
  lesson_id: string;

  @ApiModelProperty()
  @IsString({ always: true })
  @Column({ type: 'varchar' })
  playlist_id: string;

  @ApiModelProperty()
  @IsString({ always: true })
  @Column({ type: 'varchar' })
  learning_id: string;

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
