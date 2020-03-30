import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { IPlaylist } from './playlist.interface';
import { Course } from '../course/course.entity';
import { Lesson } from '../lesson/lesson.entity';
import { PlaylistCompletion } from '../../models/playlistcompletion/playlistcompletion.entity';
import { FinalExam } from '../final_exam/final_exam.entity';

@Entity('playlists')
export class Playlist implements IPlaylist {
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

  @Column('int')
  // tslint:disable-next-line: variable-name
  sort_order: number;

  @ManyToOne(type => Course, course => course.playlists, { cascade: true })
  @JoinColumn({ name: 'course_id' }) // <-- needed to add this
  course: Course;

  @Column({type: 'uuid'})
  // tslint:disable-next-line: variable-name
  course_id: string;

  @OneToMany(type => Lesson, lesson => lesson.playlist)
  lessons: Lesson[];

  @OneToMany(type => PlaylistCompletion, playlistCompletion => playlistCompletion.playlist)
  // tslint:disable-next-line: variable-name
  playlist_completions: PlaylistCompletion[];

  @OneToMany(type => FinalExam, finalExam => finalExam.playlist)
  // tslint:disable-next-line: variable-name
  final_exams: FinalExam[];

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
