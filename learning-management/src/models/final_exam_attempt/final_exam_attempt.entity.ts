import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { IFinalExamAttempt } from './final_exam_attempt.interface';
import { FinalExam } from '../final_exam/final_exam.entity';
import { FinalExamAttemptDetail } from '../final_exam_attempt_detail/final_exam_attempt_detail.entity';

@Entity('final_exam_attempts')
export class FinalExamAttempt implements IFinalExamAttempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'int', default: 1})
  // tslint:disable-next-line: variable-name
  total_attempted: number;

  @Column({type: 'int', nullable: true})
  // tslint:disable-next-line: variable-name
  total_correct: number;

  @Column({type: 'int', nullable: true})
  // tslint:disable-next-line: variable-name
  total_question: number;

  @Column({nullable: true})
  // tslint:disable-next-line: variable-name
  latest_score: string;

  @Column({type: 'int', nullable: true})
  // tslint:disable-next-line: variable-name
  elapsed_time: number;

  @Column({default: false})
  finished: boolean;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  // tslint:disable-next-line: variable-name
  latest_started_at: Date;

  @Column({type: 'uuid'})
  // tslint:disable-next-line: variable-name
  final_exam_id: string;

  @ManyToOne(type => FinalExam, finalExam => finalExam.attempts, { cascade: true })
  @JoinColumn({ name: 'final_exam_id' }) // <-- needed to add this
  // tslint:disable-next-line: variable-name
  final_exam: FinalExam;

  @OneToMany(type => FinalExamAttemptDetail, attemptDetail => attemptDetail.attempt)
  // tslint:disable-next-line: variable-name
  attempt_details: FinalExamAttemptDetail[];

  @Column({type: 'uuid'})
  // tslint:disable-next-line: variable-name
  user_id: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  // tslint:disable-next-line: variable-name
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate:  'CURRENT_TIMESTAMP' })
  // tslint:disable-next-line: variable-name
  updated_at: Date;
}
