import { ApiModelProperty } from '@nestjs/swagger';
import { CrudValidationGroups } from '@nestjsx/crud';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
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
export class AudioTrack extends BaseEntity {
  @IsString()
  @ApiModelProperty()
  @Column()
  title: string;

  @IsString()
  @Column()
  time: string;

  @IsString()
  @ApiModelProperty()
  @Column()
  minute: string;

  @IsString()
  @ApiModelProperty()
  @Column()
  second: string;

  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column({ type: 'varchar' })
  unit_id: string;

  @ManyToOne(_ => Unit, unit => unit.audio_tracks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'unit_id' })
  unit: Unit;

  @BeforeInsert()
  @BeforeUpdate()
  protected async normalize(): Promise<void> {
    if (this.second.length < 2) {
      this.second = `0${this.second}`;
    }
    if (this.minute.length < 2) {
      this.minute = `0${this.minute}`;
    }
    this.time = `${this.minute}:${this.second}`;
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
