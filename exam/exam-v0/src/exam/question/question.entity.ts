import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { CrudValidationGroups } from '@nestjsx/crud';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import uuid = require('uuid');
import { AttemptDetail } from '../attempt/attemptDetail/attemptDetail.entity';
import { BaseEntity } from '../baseEntity';
import { Exam } from '../exam.entity';
import { Answer } from './answer/answer.entity';
import { QuestionType } from './questionType.enum';
const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('questions')
export class Question extends BaseEntity {
  @ApiModelProperty()
  @IsNotEmpty({ groups: [CREATE, UPDATE] })
  @IsString({ always: true })
  @Column({ type: 'text' })
  question: string;

  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column({ type: 'varchar' })
  exam_id: string;

  @ManyToOne(() => Exam, exam => exam.questions, { cascade: true })
  @JoinColumn({ name: 'exam_id' })
  exam: Exam;

  @ApiModelPropertyOptional({
    description: `Available type : [ ${Object.values(QuestionType).join(
      ','
    )} ]`,
    nullable: true,
    example: QuestionType.MULTIPLE_CHOICE,
  })
  @IsOptional({ always: true })
  @Column({
    default: QuestionType.MULTIPLE_CHOICE,
    nullable: true,
  })
  type?: QuestionType | null;

  @OneToMany(() => Answer, answer => answer.question)
  @Type(() => Answer)
  answers: Answer[];

  @OneToMany(
    () => AttemptDetail,
    attemptDetail => attemptDetail.question_from_list
  )
  @Type(() => AttemptDetail)
  attempt_details: AttemptDetail[];

  @ApiModelPropertyOptional()
  @Column({ type: 'datetime', nullable: true })
  deleted_at?: Date | null;

  @BeforeInsert()
  protected beforeInsert(): void {
    this.id = uuid.v4();
  }
}
