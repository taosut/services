import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { IPlaylistCompletion } from './playlistcompletion.interface';
import { Playlist } from '../playlist/playlist.entity';

@Entity('playlist_completions')
export class PlaylistCompletion implements IPlaylistCompletion {
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
  playlist_id: string;

  @ManyToOne(type => Playlist, playlist => playlist.playlist_completions, { cascade: true })
  @JoinColumn({ name: 'playlist_id' }) // <-- needed to add this
  playlist: Playlist;

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
