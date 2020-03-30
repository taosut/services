import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { ILesson } from './lesson.interface';
import { Playlist } from '../playlist/playlist.entity';
import { Content } from '../content/content.entity';
import { QuizQuestion } from '../quizquestion/quizquestion.entity';
import { QuizAttempt } from '../quizattempt/quizattempt.entity';
import { LessonCompletion } from '../lessoncompletion/lessoncompletion.entity';

@Entity('lessons')
export class Lesson implements ILesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ length: 250, unique: true })
  slug: string;

  @Column({ length: 10, default: 'lecture' })
  lesson_type: string;

  @Column({type: 'text', nullable: true})
  description: string|null;

  @Column('int')
  duration: number;

  @Column('int')
  sort_order: number;

  @Column({type: 'uuid'})
  playlist_id: string;

  @ManyToOne(type => Playlist, playlist => playlist.lessons, { cascade: true })
  @JoinColumn({ name: 'playlist_id' }) // <-- needed to add this
  playlist: Playlist;

  @OneToOne(type => Content, content => content.lesson)
  content: Content;

  @OneToMany(type => QuizQuestion, question => question.quiz)
  questions: QuizQuestion[];

  @OneToMany(type => LessonCompletion, lesson_completion => lesson_completion.lesson)
  lesson_completions: LessonCompletion[];

  @OneToMany(type => QuizAttempt, quiz_attempt => quiz_attempt.quiz)
  quiz_attempts: QuizAttempt[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate:  'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  deleted_at: Date|null;
}
