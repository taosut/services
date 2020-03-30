import { ApiModelProperty } from '@nestjs/swagger';
import { IMembership } from '../../membership/interfaces/membership.interface';

export abstract class IUser {
  @ApiModelProperty()
  id: string;
  // username: string;
  // password: string;

  @ApiModelProperty()
  keycloakId?: string;

  @ApiModelProperty()
  fullName: string;

  @ApiModelProperty()
  nickName?: string;

  @ApiModelProperty()
  email: string;

  @ApiModelProperty()
  emailVerified: boolean;

  @ApiModelProperty()
  twitterAccount?: string;

  @ApiModelProperty()
  twitterEmail?: string;

  @ApiModelProperty()
  facebookAccount?: string;

  @ApiModelProperty()
  facebookEmail?: string;

  @ApiModelProperty()
  googleEmail?: string;

  @ApiModelProperty()
  gender?: string;

  @ApiModelProperty()
  address?: string;

  @ApiModelProperty()
  province?: string;

  @ApiModelProperty()
  district?: string;

  @ApiModelProperty()
  postalCode?: string;

  @ApiModelProperty()
  phoneNumber?: string;

  @ApiModelProperty()
  birthday?: Date;

  @ApiModelProperty()
  registrationStatus?: string;

  @ApiModelProperty()
  registrationDate?: Date;

  @ApiModelProperty()
  registrationIp?: string;

  @ApiModelProperty()
  activationKey?: string;

  @ApiModelProperty()
  lastVisited?: string;

  @ApiModelProperty()
  membershipStatus?: string;

  @ApiModelProperty()
  invoiceStatus?: string;

  @ApiModelProperty()
  isDeleted: boolean;

  @ApiModelProperty()
  signUpAt?: Date;

  @ApiModelProperty()
  signUpIp?: string;

  @ApiModelProperty()
  lastVisitAt?: Date;

  @ApiModelProperty()
  stage?: string;

  @ApiModelProperty()
  highschoolSpecializationGroup?: string;

  @ApiModelProperty()
  curriculum?: string;

  @ApiModelProperty()
  school: string;

  @ApiModelProperty()
  class?: string;

  @ApiModelProperty()
  createdAt: Date;

  @ApiModelProperty()
  updatedAt: Date;

  @ApiModelProperty()
  memberships?: IMembership[];
}

export enum EUserStatus {
  teacher = 'teacher',
  student = 'student',
  parent = 'parent',
  general = 'general',
}

export enum EUserInvoiceStatus {
  pending = 'pending',
  new = 'new',
  transferConfirm = 'transfer confirm',
  waitingForReconfirmation = 'waiting for reconfirmation',
  paid = 'paid',
  delivered = 'delivered',
}

export enum EMemberRoles {
  regularMember = 'regular member',
  premiumMember = 'premium member',
}
