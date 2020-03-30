import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Membership } from '../membership/membership.entity';
import { IUser } from './interfaces/user.interface';

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Column()
  // username: string;

  // @Column()
  // password: string;

  @Column({ nullable: true })
  keycloakId: string;

  @Column({ nullable: true })
  nickName: string;

  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ nullable: true })
  twitterAccount: string;

  @Column({ nullable: true })
  twitterEmail: string;

  @Column({ nullable: true })
  facebookAccount: string;

  @Column({ nullable: true })
  facebookEmail: string;

  @Column({ nullable: true })
  googleEmail: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  province: string;

  @Column({ nullable: true })
  district: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  birthday: Date;

  @Column({ nullable: true })
  registrationStatus: string;

  @Column({ nullable: true })
  registrationDate: Date;

  @Column({ nullable: true })
  registrationIp: string;

  @Column({ nullable: true })
  activationKey: string;

  @Column({ nullable: true })
  lastVisited: string;

  @Column({ nullable: true })
  membershipStatus: string;

  @Column({ nullable: true })
  invoiceStatus: string;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ nullable: true })
  signUpAt: Date;

  @Column({ nullable: true })
  signUpIp: string;

  @Column({ nullable: true })
  lastVisitAt: Date;

  @Column({ nullable: true })
  stage: string;

  @Column({ nullable: true })
  highschoolSpecializationGroup: string;

  @Column({ nullable: true })
  curriculum: string;

  @Column({ nullable: true })
  school: string;

  @Column({ nullable: true })
  class: string;

  @Column({ nullable: true })
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;

  @OneToMany(_ => Membership, membership => membership.user)
  memberships: Membership[];

  @BeforeInsert()
  protected beforeInsert(): void {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  protected beforeUpdate(): void {
    this.updatedAt = new Date();
  }
}
