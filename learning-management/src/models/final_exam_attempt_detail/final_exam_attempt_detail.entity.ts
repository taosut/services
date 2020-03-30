import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { IFinalExamAttemptDetail } from './final_exam_attempt_detail.interface';
import { FinalExamAttempt } from '../final_exam_attempt/final_exam_attempt.entity';
import { FinalExamQuestion } from '../final_exam_question/final_exam_question.entity';
import { FinalExamAnswer } from '../final_exam_answer/final_exam_answer.entity';

@Entity('final_exam_attempt_details')
export class FinalExamAttemptDetail implements IFinalExamAttemptDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  question: string;

  @Column('int')
  // tslint:disable-next-line: variable-name
  sort_order: number;

  @Column({type: 'uuid'})
  // tslint:disable-next-line: variable-name
  question_id: string;

  @ManyToOne(type => FinalExamQuestion, question => question.attempt_details, { cascade: true })
  @JoinColumn({ name: 'question_id' }) // <-- needed to add this
// tslint:disable-next-line: variable-name
  final_exam_question: FinalExamQuestion;

  @Column({type: 'uuid'})
  // tslint:disable-next-line: variable-name
  choosen_answer_id: string;

  @ManyToOne(type => FinalExamAnswer, finalExamAnswer => finalExamAnswer.choosen_attempt_details, { cascade: true })
  @JoinColumn({ name: 'choosen_answer_id' }) // <-- needed to add this
  // tslint:disable-next-line: variable-name
  choosen_answer: FinalExamAnswer;

  @Column({type: 'uuid'})
  // tslint:disable-next-line: variable-name
  correct_answer_id: string;

  @ManyToOne(type => FinalExamAnswer, finalExamAnswer => finalExamAnswer.correct_attempt_details, { cascade: true })
  @JoinColumn({ name: 'correct_answer_id' }) // <-- needed to add this
  // tslint:disable-next-line: variable-name
  correct_answer: FinalExamAnswer;

  @Column({type: 'uuid'})
  // tslint:disable-next-line: variable-name
  attempt_id: string;

  @ManyToOne(type => FinalExamAttempt, finalExamAttempt => finalExamAttempt.attempt_details, { cascade: true })
  @JoinColumn({ name: 'attempt_id' }) // <-- needed to add this
  // tslint:disable-next-line: variable-name
  attempt: FinalExamAttempt;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  // tslint:disable-next-line: variable-name
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate:  'CURRENT_TIMESTAMP' })
  // tslint:disable-next-line: variable-name
  updated_at: Date;
}
