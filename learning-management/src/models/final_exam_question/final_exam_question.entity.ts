import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { IFinalExamQuestion } from './final_exam_question.interface';
import { FinalExam } from '../final_exam/final_exam.entity';
import { FinalExamAnswer } from '../final_exam_answer/final_exam_answer.entity';
import { FinalExamAttemptDetail } from '../final_exam_attempt_detail/final_exam_attempt_detail.entity';

@Entity('final_exam_questions')
export class FinalExamQuestion implements IFinalExamQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  question: string;

  @Column({type: 'uuid'})
// tslint:disable-next-line: variable-name
  final_exam_id: string;

  @ManyToOne(type => FinalExam, finalExam => finalExam.questions, { cascade: true })
  @JoinColumn({ name: 'final_exam_id' }) // <-- needed to add this
// tslint:disable-next-line: variable-name
  final_exam: FinalExam;

  @OneToMany(type => FinalExamAnswer, answer => answer.question)
  answers: FinalExamAnswer[];

  @OneToMany(type => FinalExamAttemptDetail, attemptDetail => attemptDetail.final_exam_question)
// tslint:disable-next-line: variable-name
  attempt_details: FinalExamAttemptDetail[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
// tslint:disable-next-line: variable-name
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate:  'CURRENT_TIMESTAMP' })
// tslint:disable-next-line: variable-name
  updated_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
// tslint:disable-next-line: variable-name
  deleted_at: Date|null;
}
