import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { IFinalExam } from './final_exam.interface';
import { Playlist } from '../playlist/playlist.entity';
import { Track } from '../track/track.entity';
import { Course } from '../course/course.entity';
import { FinalExamQuestion } from '../final_exam_question/final_exam_question.entity';
import { FinalExamAttempt } from '../final_exam_attempt/final_exam_attempt.entity';

@Entity('final_exams')
export class FinalExam implements IFinalExam {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ length: 250, unique: true })
  slug: string;

  @Column({type: 'text', nullable: true})
  description: string|null;

  @Column('int')
  duration: number;

  @Column({type: 'boolean', default: false})
  published: boolean;

  @Column({type: 'uuid', nullable: true})
  // tslint:disable-next-line: variable-name
  track_id: string;

  @ManyToOne(type => Track, track => track.final_exams, { cascade: true })
  @JoinColumn({ name: 'track_id' }) // <-- needed to add this
  track: Track;

  @Column({type: 'uuid', nullable: true})
  // tslint:disable-next-line: variable-name
  course_id: string;

  @ManyToOne(type => Course, course => course.final_exams, { cascade: true })
  @JoinColumn({ name: 'course_id' }) // <-- needed to add this
  course: Course;

  @Column({type: 'uuid', nullable: true})
  // tslint:disable-next-line: variable-name
  playlist_id: string;

  @ManyToOne(type => Playlist, playlist => playlist.final_exams, { cascade: true })
  @JoinColumn({ name: 'playlist_id' }) // <-- needed to add this
  playlist: Playlist;

  @OneToMany(type => FinalExamQuestion, finalExam => finalExam.final_exam)
  questions: FinalExamQuestion;

  @OneToMany(type => FinalExamAttempt, finalExamAttempt => finalExamAttempt.final_exam)
  attempts: FinalExamAttempt;

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
