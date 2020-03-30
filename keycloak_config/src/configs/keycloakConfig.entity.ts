import { HttpException } from '@nestjs/common';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  getRepository,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { IKeycloakConfig } from './interfaces/keycloakConfig.interface';

@Entity()
export class KeycloakConfig implements IKeycloakConfig {
  @IsOptional()
  @ApiModelProperty()
  @PrimaryGeneratedColumn('uuid')
  id?: string = uuid();

  @IsString()
  @IsNotEmpty()
  @ApiModelProperty()
  @Column({ unique: true })
  realm: string;

  @IsString()
  @IsNotEmpty()
  @ApiModelProperty()
  @Column()
  client: string;

  @IsBoolean()
  @ApiModelProperty()
  @Column({ default: true })
  public: boolean;

  @CreateDateColumn({ nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ nullable: true })
  updated_at?: Date;

  @BeforeInsert()
  @BeforeUpdate()
  protected async checkForDuplicate(): Promise<void> {
    const keycloakRepo = await getRepository(KeycloakConfig);

    const isExist = await keycloakRepo.findOne({
      realm: this.realm,
    });

    if (isExist && isExist.id !== this.id) {
      throw new HttpException('Duplicate realm¡', 409);
    }
  }
}
