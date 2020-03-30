import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { IContentAttachment } from './contentattachment.interface';
import { Content } from '../content/content.entity';

@Entity('content_attachments')
export class ContentAttachment implements IContentAttachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200, nullable: true })
  name: string;

  @Column({ length: 50, nullable: true })
  type: string;

  @Column({ default: 0 })
  size: number;

  @Column({type: 'text'})
  path: string;

  @ManyToOne(type => Content, content => content.content_attachments, { cascade: true })
  @JoinColumn({ name: 'content_id' }) // <-- needed to add this
  content: Content;

  @Column({type: 'uuid'})
  content_id: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate:  'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  deleted_at: Date|null;
}
