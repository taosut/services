import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { IFinalExamAnswer } from './final_exam_answer.interface';
import { FinalExamQuestion } from '../final_exam_question/final_exam_question.entity';
import { FinalExamAttemptDetail } from '../final_exam_attempt_detail/final_exam_attempt_detail.entity';

@Entity('final_exam_answers')
export class FinalExamAnswer implements IFinalExamAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  answer: string;

  @Column({ type: 'boolean', default: false })
  correct: boolean;

  @Column({type: 'uuid'})
// tslint:disable-next-line: variable-name
  question_id: string;

  @ManyToOne(type => FinalExamQuestion, finalExamQuestion => finalExamQuestion.answers, { cascade: true })
  @JoinColumn({ name: 'question_id' }) // <-- needed to add this
  question: FinalExamQuestion;

  @OneToMany(type => FinalExamAttemptDetail, attemptDetail => attemptDetail.choosen_answer)
// tslint:disable-next-line: variable-name
  choosen_attempt_details: FinalExamAttemptDetail[];

  @OneToMany(type => FinalExamAttemptDetail, attemptDetail => attemptDetail.correct_answer)
  // tslint:disable-next-line: variable-name
  correct_attempt_details: FinalExamAttemptDetail[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
// tslint:disable-next-line: variable-name
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate:  'CURRENT_TIMESTAMP' })
// tslint:disable-next-line: variable-name
  updated_at: Date;
}
