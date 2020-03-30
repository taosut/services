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
  @Column({ type: 'longtext' })
  answer: string;

  @ApiModelPropertyOptional()
  @Column({ nullable: true })
  image_id?: string | null;

  @ApiModelPropertyOptional()
  @Column({ nullable: true })
  video_id?: string | null;

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
  @ManyToOne(() => Question, question => question.answers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'question_id' }) // <-- needed to add this
  question: Question;

  @BeforeInsert()
  protected beforeInsert(): void {
    this.id = uuid.v4();
  }
}
