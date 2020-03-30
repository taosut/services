import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { ILessonCompletion } from './lessoncompletion.interface';
import { Lesson } from '../lesson/lesson.entity';

@Entity('lesson_completions')
export class LessonCompletion implements ILessonCompletion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
// tslint:disable-next-line: variable-name
  elapsed_time: number;

  @Column()
  progress: string;

  @Column({ type: 'boolean', default: false })
  finished: boolean;

  @Column({type: 'uuid'})
  // tslint:disable-next-line: variable-name
  lesson_id: string;

  @ManyToOne(type => Lesson, lesson => lesson.lesson_completions, { cascade: true })
  @JoinColumn({ name: 'lesson_id' }) // <-- needed to add this
  lesson: Lesson;

  @Column({type: 'uuid', nullable: true})
  // tslint:disable-next-line: variable-name
  user_id: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  // tslint:disable-next-line: variable-name
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate:  'CURRENT_TIMESTAMP' })
  // tslint:disable-next-line: variable-name
  updated_at: Date;
}
