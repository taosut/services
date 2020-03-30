import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ICourseUser } from './courseuser.interface';
import { Course } from '../course/course.entity';

@Entity('course_users')
export class CourseUser implements ICourseUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({default: false})
// tslint:disable-next-line: variable-name
  has_joined: boolean;

  @Column({type: 'uuid'})
  // tslint:disable-next-line: variable-name
  course_id: string;

  @ManyToOne(type => Course, course => course.course_users, { cascade: true })
  @JoinColumn({ name: 'course_id' }) // <-- needed to add this
  course: Course;

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
