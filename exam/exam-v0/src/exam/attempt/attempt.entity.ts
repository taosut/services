import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import uuid = require('uuid');
import { BaseEntity } from '../baseEntity';
import { Exam } from '../exam.entity';
import { AttemptDetail } from './attemptDetail/attemptDetail.entity';

@Entity('attempts')
export class Attempt extends BaseEntity {
  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @IsNumber()
  @Column({ type: 'int', default: 1 })
  total_attempted: number;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @Column({ type: 'int', nullable: true })
  total_correct: number;

  @ApiModelPropertyOptional()
  @Column({ type: 'int', nullable: true })
  total_question: number;

  @ApiModelPropertyOptional()
  @Column({ nullable: true })
  latest_score: string;

  @ApiModelPropertyOptional()
  @Column({ type: 'int', nullable: true })
  elapsed_time: number;

  @ApiModelPropertyOptional()
  @Column({ default: false })
  finished: boolean;

  @ApiModelPropertyOptional()
  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  latest_started_at: Date;

  @ApiModelProperty()
  @Column({ type: 'varchar' })
  exam_id: string;

  @ManyToOne(() => Exam, exam => exam.attempts, { cascade: true })
  @JoinColumn({ name: 'exam_id' })
  exam: Exam;

  @OneToMany(() => AttemptDetail, attemptDetail => attemptDetail.attempt)
  attempt_details: AttemptDetail[];

  @ApiModelProperty()
  @Column({ type: 'varchar' })
  user_id: string;

  @BeforeInsert()
  protected beforeInsert(): void {
    this.id = uuid.v4();
  }
}
