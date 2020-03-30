import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { IQuizAttempt } from './quizattempt.interface';
import { Lesson } from '../lesson/lesson.entity';
import { QuizAttemptDetail } from '../quizattemptdetail/quizattemptdetail.entity';

@Entity('quiz_attempts')
export class QuizAttempt implements IQuizAttempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'int', default: 1})
  total_attempted: number;

  @Column({type: 'int', nullable: true})
  total_correct: number;

  @Column({type: 'int', nullable: true})
  total_question: number;

  @Column({nullable: true})
  latest_score: string;

  @Column({type: 'int', nullable: true})
  elapsed_time: number;

  @Column({default: false})
  finished: boolean;
  
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  latest_started_at: Date;

  @Column({type: 'uuid'})
  quiz_id: string;

  @ManyToOne(type => Lesson, quiz => quiz.quiz_attempts, { cascade: true })
  @JoinColumn({ name: 'quiz_id' }) // <-- needed to add this
  quiz: Lesson;

  @OneToMany(type => QuizAttemptDetail, attempt_detail => attempt_detail.quiz_attempt)
  attempt_details: QuizAttemptDetail[];

  @Column({type: 'uuid'})
  user_id: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate:  'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
