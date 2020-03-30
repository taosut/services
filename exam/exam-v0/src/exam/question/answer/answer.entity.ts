import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { CrudValidationGroups } from '@nestjsx/crud';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import uuid = require('uuid');
import { BaseEntity } from '../../../exam/baseEntity';
import { Question } from '../question.entity';
const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('answers')
export class Answer extends BaseEntity {
  @ApiModelProperty()
  @IsNotEmpty({ groups: [CREATE, UPDATE] })
  @IsString({ always: true })
  @Column()
  answer: string;

  @ApiModelPropertyOptional()
  @IsBoolean({ always: true })
  @Column({ type: 'boolean', default: false })
  correct: boolean;

  @ApiModelPropertyOptional()
  @Column({ type: 'float', nullable: true })
  score?: string | number | null;

  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column()
  question_id: string;

  @ApiModelPropertyOptional()
  @ManyToOne(() => Question, question => question.answers, { cascade: true })
  @JoinColumn({ name: 'question_id' }) // <-- needed to add this
  question: Question;

  @BeforeInsert()
  protected beforeInsert(): void {
    this.id = uuid.v4();
  }
}
