import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { IContent } from './content.interface';
import { Lesson } from '../lesson/lesson.entity';
import { ContentAttachment } from '../contentattachment/contentattachment.entity';

@Entity('contents')
export class Content implements IContent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'text', nullable: true})
  content: string|null;

  @Column({ length: 100 })
// tslint:disable-next-line: variable-name
  video_source: string|null;

  @Column({ length: 250 })
  // tslint:disable-next-line: variable-name
  video_link: string|null;

  @Column({ type: 'int', nullable: true })
  duration: number|null;

  @Column({type: 'uuid'})
  // tslint:disable-next-line: variable-name
  lesson_id: string;

  @OneToOne(type => Lesson, lesson => lesson.content, { cascade: true })
  @JoinColumn({ name: 'lesson_id' }) // <-- needed to add this
  lesson: Lesson;

// tslint:disable-next-line: variable-name
  @OneToMany(type => ContentAttachment, content_attachment => content_attachment.content)
  // tslint:disable-next-line: variable-name
  content_attachments: ContentAttachment[];

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
