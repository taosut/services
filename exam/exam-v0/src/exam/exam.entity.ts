import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { CrudValidationGroups } from '@nestjsx/crud';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import uuid = require('uuid');
import { learningType } from '../learning/learningType.enum';
import { Attempt } from './attempt/attempt.entity';
import { BaseEntity } from './baseEntity';
import { Question } from './question/question.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('exams')
export class Exam extends BaseEntity {
  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @MaxLength(200, { always: true })
  @Column({ length: 200 })
  title: string;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @IsString({ always: true })
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Column({ type: 'int', default: 0 })
  duration: number;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @IsBoolean({ always: true })
  @Column({ type: 'boolean', default: false })
  published: boolean;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @Column({ type: 'datetime', nullable: true })
  started_at: Date | null;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @Column({ type: 'datetime', nullable: true })
  ended_at: Date | null;

  @ApiModelPropertyOptional({
    description: `Available : [ ${Object.values(learningType).join(',')} ] `,
  })
  @IsOptional({ always: true })
  @Column({
    default: learningType.UNIT,
    nullable: true,
  })
  part_of: learningType | null;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @Column({ nullable: true })
  part_of_id: string | null;

  @OneToMany(() => Question, examQuestion => examQuestion.exam)
  @Type(() => Question)
  questions: Question[];

  @OneToMany(() => Attempt, examAttempt => examAttempt.exam)
  @Type(() => Attempt)
  attempts: Attempt[];

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @Column({ type: 'datetime', nullable: true })
  deleted_at: Date | null;

  @BeforeInsert()
  protected beforeInsert(): void {
    this.id = uuid.v4();
  }
}
