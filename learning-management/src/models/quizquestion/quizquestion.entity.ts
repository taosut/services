import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { IQuizQuestion } from './quizquestion.interface';
import { Lesson } from '../lesson/lesson.entity';
import { Content } from '../content/content.entity';
import { QuizAnswer } from '../quizanswer/quizanswer.entity';
import { QuizAttemptDetail } from '../quizattemptdetail/quizattemptdetail.entity';

@Entity('quiz_questions')
export class QuizQuestion implements IQuizQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  question: string;

  @ManyToOne(type => Lesson, lesson => lesson.questions, { cascade: true })
  @JoinColumn({ name: 'quiz_id' }) // <-- needed to add this
  quiz: Lesson;

  @Column({type: 'uuid'})
  quiz_id: string;

  @OneToMany(type => QuizAnswer, answer => answer.question)
  answers: QuizAnswer[];
  
  @OneToMany(type => QuizAttemptDetail, attempt_detail => attempt_detail.quiz_question)
  attempt_details: QuizAttemptDetail[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate:  'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  deleted_at: Date|null;
}
