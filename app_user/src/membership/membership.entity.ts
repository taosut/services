import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { EProductType, IMembership } from './interfaces/membership.interface';

@Entity()
export class Membership implements IMembership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(_ => User, user => user.memberships)
  user: User;

  @Column()
  productId: string;

  @Column()
  productType: EProductType;

  @Column({ nullable: true })
  activatedAt: Date;

  @Column({ nullable: true })
  expiredAt: Date;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ default: null })
  status: string;

  @BeforeInsert()
  protected beforeInsert(): void {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  protected beforeUpdate(): void {
    this.updatedAt = new Date();
  }
}
