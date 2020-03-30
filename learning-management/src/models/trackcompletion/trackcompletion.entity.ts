import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { ITrackCompletion } from './trackcompletion.interface';

@Entity('track_completions')
export class TrackCompletion implements ITrackCompletion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float', default: 0 })
// tslint:disable-next-line: variable-name
  total_progress: string;

  @Column({ type: 'float', default: 0 })
  // tslint:disable-next-line: variable-name
  lecture_progress: string;

  @Column({ type: 'float', default: 0 })
  // tslint:disable-next-line: variable-name
  quiz_progress: string;

  @Column({ type: 'float', default: 0 })
  // tslint:disable-next-line: variable-name
  quiz_score: string;

  @Column({ type: 'int', nullable: true })
  // tslint:disable-next-line: variable-name
  quiz_rank: number;

  @Column({ type: 'int', nullable: true })
  // tslint:disable-next-line: variable-name
  overall_rank: number;

  @Column({ type: 'boolean', default: false })
  finished: boolean;

  @Column({type: 'uuid'})
  // tslint:disable-next-line: variable-name
  track_id: string;

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
