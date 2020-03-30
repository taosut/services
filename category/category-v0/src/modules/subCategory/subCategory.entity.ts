import { HttpException } from '@nestjs/common';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import cryptoRandomString = require('crypto-random-string');
import slugify from 'slugify';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  getRepository,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from '../base-entity';
import { Category } from '../category/category.entity';

@Entity()
export class SubCategory extends BaseEntity {
  @Column({ unique: true })
  slug: string;

  @ApiModelProperty({ required: true })
  @IsString()
  @Column({ length: 200, unique: true })
  name: string;

  @ApiModelProperty()
  @IsOptional({ always: true })
  @IsString()
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiModelProperty()
  @IsOptional({ always: true })
  @IsString()
  @Column({ nullable: true })
  previewFileId: string;

  @IsString()
  @Column()
  categoryId: string;

  @ApiModelProperty()
  @ManyToOne(() => Category, category => category.subCategories)
  category: Category;

  @BeforeInsert()
  protected async beforeInsert(): Promise<void> {
    this.slug = slugify(this.name + '-' + cryptoRandomString({ length: 5 }), {
      replacement: '-',
      remove: /[^\w\-]/g,
      lower: true,
    });

    await this.normalize();
  }

  @BeforeUpdate()
  protected async normalize(): Promise<void> {
    const subCategoryRepo = await getRepository(SubCategory);
    const categoryRepo = await getRepository(Category);

    const nameExist = await subCategoryRepo.findOne({ name: this.name });

    if (nameExist && nameExist.id !== this.id) {
      throw new HttpException('Duplicate Name', 409);
    }

    const slugExist = await subCategoryRepo.findOne({ slug: this.slug });

    if (slugExist && slugExist.id !== this.id) {
      throw new HttpException('Duplicate Slug', 409);
    }

    const category = await categoryRepo.findOne({
      slug: this['category.slug'],
    });

    if (category) {
      this.categoryId = category.id;
    }

    this.category = category;
  }
}
