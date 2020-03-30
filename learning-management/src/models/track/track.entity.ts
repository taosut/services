import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn } from 'typeorm';
import { ITrack } from './track.interface';
import { Course } from '../course/course.entity';
import { FinalExam } from '../final_exam/final_exam.entity';

@Entity('tracks')
export class Track implements ITrack {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ length: 250, unique: true })
  slug: string;

  @Column({length: 300, nullable: true})
  preview: string|null;

  @Column({type: 'text', nullable: true})
  description: string|null;

  @Column({type: 'text', nullable: true})
  requirement: string|null;

  @Column({default: false})
  published: boolean;

  @Column('int')
// tslint:disable-next-line: variable-name
  sort_order: number;

  @OneToMany(type => Course, course => course.track)
  courses: Course[];

  @OneToMany(type => FinalExam, finalExam => finalExam.track)
  // tslint:disable-next-line: variable-name
  final_exams: FinalExam[];

  @Column({type: 'uuid'})
// tslint:disable-next-line: variable-name
  user_id: string|null;

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
