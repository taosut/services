import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { IQuizAnswer } from '././quizanswer.interface';
import { Lesson } from '../lesson/lesson.entity';
import { Content } from '../content/content.entity';
import { QuizQuestion } from '../quizquestion/quizquestion.entity';
import { QuizAttemptDetail } from '../quizattemptdetail/quizattemptdetail.entity';

@Entity('quiz_answers')
export class QuizAnswer implements IQuizAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  answer: string;

  @Column({ type: 'boolean', default: false })
  correct: boolean;

  @Column({type: 'uuid'})
  question_id: string;

  @ManyToOne(type => QuizQuestion, quizQuestion => quizQuestion.answers, { cascade: true })
  @JoinColumn({ name: 'question_id' }) // <-- needed to add this
  question: QuizQuestion;

  @OneToMany(type => QuizAttemptDetail, attempt_detail => attempt_detail.choosen_answer)
  choosen_attempt_details: QuizAttemptDetail[];

  @OneToMany(type => QuizAttemptDetail, attempt_detail => attempt_detail.correct_answer)
  correct_attempt_details: QuizAttemptDetail[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate:  'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
