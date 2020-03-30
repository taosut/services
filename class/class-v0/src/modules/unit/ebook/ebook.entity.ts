import { ApiModelProperty } from '@nestjs/swagger';
import { CrudValidationGroups } from '@nestjsx/crud';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  getRepository,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from '../../base-entity';
import { Unit } from '../unit.entity';
const { CREATE, UPDATE } = CrudValidationGroups;

@Entity()
export class Ebook extends BaseEntity {
  @IsString()
  @ApiModelProperty()
  @Column()
  title: string;

  @IsString()
  @ApiModelProperty()
  @Column({ type: 'longtext' })
  content: string;

  @IsNumber()
  @ApiModelProperty()
  @Column()
  page_number: number;

  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column({ type: 'varchar' })
  unit_id: string;

  @ManyToOne(_ => Unit, unit => unit.ebooks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'unit_id' })
  unit: Unit;

  @BeforeInsert()
  @BeforeUpdate()
  protected async normalize(): Promise<void> {
    const unitRepo = await getRepository(Unit);

    if (this['unit.slug']) {
      const unit = await unitRepo.findOneOrFail({
        slug: this['unit.slug'],
      });

      this.unit = unit;
      this.unit_id = unit.id;
    }
  }
}
