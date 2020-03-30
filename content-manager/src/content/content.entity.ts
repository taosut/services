import slugify from 'slugify';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../src/base-entity';
import { EContentType } from './interfaces/content.const';
import { IContent } from './interfaces/content.interface';

@Entity()
export class Content extends BaseEntity implements IContent {
  @Column()
  name: string;

  @Column({ default: 0 })
  size: number;

  @Column({ nullable: true })
  path: string;

  @Column()
  realm: string;

  @Column()
  ownership: string;

  @Column({ default: EContentType.image })
  fileType: EContentType;

  @Column()
  uploadedBy: string;

  @BeforeInsert()
  @BeforeUpdate()
  protected async normalize(): Promise<void> {
    const fileName = `${this.id}-${slugify(this.name.toString())}`;
    const extension = `.${this.fileType.split('/')[1]}`;
    const dir = `files/uploads/${this.ownership}/`;
    this.path = (dir + fileName + extension).toLowerCase();
  }
}
