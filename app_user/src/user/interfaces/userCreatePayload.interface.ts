import { ApiModelProperty } from '@nestjs/swagger';

export abstract class IUserCreatePayload {
  @ApiModelProperty({ required: false })
  id?: string;

  @ApiModelProperty()
  username: string;

  @ApiModelProperty()
  password: string;

  @ApiModelProperty()
  fullName: string;

  @ApiModelProperty({ required: false })
  nickName?: string;

  @ApiModelProperty()
  email: string;

  @ApiModelProperty({ required: false })
  emailVerified?: boolean;

  @ApiModelProperty({ required: false })
  userStatus?: string;

  @ApiModelProperty({ required: false })
  twitterAccount?: string;

  @ApiModelProperty({ required: false })
  twitterEmail?: string;

  @ApiModelProperty({ required: false })
  facebookAccount?: string;

  @ApiModelProperty({ required: false })
  facebookEmail?: string;

  @ApiModelProperty({ required: false })
  googleEmail?: string;

  @ApiModelProperty({ required: false })
  gender?: string;

  @ApiModelProperty({ required: false })
  address?: string;

  @ApiModelProperty({ required: false })
  province?: string;

  @ApiModelProperty({ required: false })
  district?: string;

  @ApiModelProperty({ required: false })
  postalCode?: string;

  @ApiModelProperty({ required: false })
  phoneNumber?: string;

  @ApiModelProperty({ required: false })
  birthday?: Date;

  @ApiModelProperty({ required: false })
  registrationStatus?: string;

  @ApiModelProperty({ required: false })
  registrationDate?: Date;

  @ApiModelProperty({ required: false })
  registrationIp?: string;

  @ApiModelProperty({ required: false })
  activationKey?: string;

  @ApiModelProperty({ required: false })
  lastVisited?: string;

  @ApiModelProperty({ required: false })
  membershipStatus?: string;

  @ApiModelProperty({ required: false })
  invoiceStatus?: string;

  @ApiModelProperty({ required: false })
  isDeleted?: boolean;

  @ApiModelProperty({ required: false })
  signUpAt?: Date;

  @ApiModelProperty({ required: false })
  signUpIp?: string;

  @ApiModelProperty({ required: false })
  lastVisitAt?: Date;

  @ApiModelProperty({ required: false })
  stage?: string;

  @ApiModelProperty({ required: false })
  highschoolSpecializationGroup?: string;

  @ApiModelProperty({ required: false })
  curriculum?: string;

  @ApiModelProperty({ required: false })
  school?: string;

  @ApiModelProperty({ required: false })
  class?: string;
}
