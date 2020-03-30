import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { IQuizAttemptDetail } from './quizattemptdetail.interface';
import { QuizAttempt } from '../quizattempt/quizattempt.entity';
import { QuizQuestion } from '../quizquestion/quizquestion.entity';
import { QuizAnswer } from '../quizanswer/quizanswer.entity';

@Entity('quiz_attempt_details')
export class QuizAttemptDetail implements IQuizAttemptDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  question: string;

  @Column('int')
  sort_order: number;

  @Column({type: 'uuid'})
  question_id: string;
  
  @ManyToOne(type => QuizQuestion, question => question.attempt_details, { cascade: true })
  @JoinColumn({ name: 'question_id' }) // <-- needed to add this
  quiz_question: QuizQuestion;

  @Column({type: 'uuid'})
  choosen_answer_id: string;

  @ManyToOne(type => QuizAnswer, quiz_answer => quiz_answer.choosen_attempt_details, { cascade: true })
  @JoinColumn({ name: 'choosen_answer_id' }) // <-- needed to add this
  choosen_answer: QuizAnswer;

  @Column({type: 'uuid'})
  correct_answer_id: string;

  @ManyToOne(type => QuizAnswer, quiz_answer => quiz_answer.correct_attempt_details, { cascade: true })
  @JoinColumn({ name: 'correct_answer_id' }) // <-- needed to add this
  correct_answer: QuizAnswer;

  @Column({type: 'uuid'})
  quiz_attempt_id: string;
  
  @ManyToOne(type => QuizAttempt, quiz_attempt => quiz_attempt.attempt_details, { cascade: true })
  @JoinColumn({ name: 'quiz_attempt_id' }) // <-- needed to add this
  quiz_attempt: QuizAttempt;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate:  'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
