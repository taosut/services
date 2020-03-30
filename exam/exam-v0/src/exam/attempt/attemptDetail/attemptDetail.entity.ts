import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import uuid = require('uuid');
import { BaseEntity } from '../../baseEntity';
import { Question } from '../../question/question.entity';
import { Attempt } from '../attempt.entity';

@Entity('attempt_details')
export class AttemptDetail extends BaseEntity {
  @ApiModelProperty()
  @IsNotEmpty({ always: true })
  @Column({ type: 'text' })
  question: string;

  @ApiModelProperty()
  @Column('int')
  sort_order: number;

  @ApiModelProperty()
  @Column()
  question_id: string;

  @ManyToOne(() => Question, question => question.attempt_details, {
    cascade: true,
  })
  @JoinColumn({ name: 'question_id' })
  question_from_list: Question;

  @ApiModelPropertyOptional()
  @Column({ type: 'simple-array', nullable: true })
  choosen_answer_ids: string[] | null;

  @ApiModelPropertyOptional()
  @Column({ type: 'simple-array', nullable: true })
  correct_answer_ids: string[] | null;

  @ApiModelProperty()
  @Column()
  attempt_id: string;

  @ManyToOne(() => Attempt, attempt => attempt.attempt_details, {
    cascade: true,
  })
  @JoinColumn({ name: 'attempt_id' })
  attempt: Attempt;

  @BeforeInsert()
  protected beforeInsert(): void {
    this.id = uuid.v4();
  }
}
