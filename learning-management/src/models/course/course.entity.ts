import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Track } from '../track/track.entity';
import { ICourse } from './course.interface';
import { Playlist } from '../playlist/playlist.entity';
import { CourseUser } from '../courseuser/courseuser.entity';
import { FinalExam } from '../final_exam/final_exam.entity';

@Entity('courses')
export class Course implements ICourse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({length: 250, unique: true})
  slug: string;

  @Column({length: 300, nullable: true})
  preview: string|null;

  @Column({type: 'text', nullable: true})
  description: string|null;

  @Column({type: 'text', nullable: true})
// tslint:disable-next-line: variable-name
  term_and_condition: string|null;

  @Column({default: false})
  published: boolean;

  @Column({default: false})
  approved: boolean;

  @Column('int')
  // tslint:disable-next-line: variable-name
  sort_order: number;

  @Column({type: 'uuid'})
  // tslint:disable-next-line: variable-name
  user_id: string|null;

  @Column({ type: 'uuid', nullable: true })
  // tslint:disable-next-line: variable-name
  track_id: string|null;

  @ManyToOne(type => Track, track => track.courses, { cascade: true })
  @JoinColumn({ name: 'track_id' }) // <-- needed to add this
  track: Track;

  @OneToMany(type => Playlist, playlist => playlist.course)
  playlists: Playlist[];

  @OneToMany(type => CourseUser, courseUser => courseUser.course)
  // tslint:disable-next-line: variable-name
  course_users: CourseUser[];

  @OneToMany(type => FinalExam, finalExam => finalExam.course)
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
