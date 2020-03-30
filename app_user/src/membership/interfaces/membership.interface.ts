import { ApiModelProperty } from '@nestjs/swagger';
import { IUser } from '../../user/interfaces/user.interface';

export abstract class IMembership {
  @ApiModelProperty()
  id: string;

  @ApiModelProperty()
  user?: IUser;

  @ApiModelProperty()
  productType: EProductType;

  @ApiModelProperty()
  productId: string;

  @ApiModelProperty()
  activatedAt: Date;

  @ApiModelProperty()
  expiredAt: Date;

  @ApiModelProperty()
  createdAt: Date;

  @ApiModelProperty()
  updatedAt: Date;

  @ApiModelProperty()
  status: string;

  @ApiModelProperty()
  isDeleted: boolean;
}

export interface IExpirationDate {
  expiredAt: Date;
  activatedAt: Date;
}

export enum EProductType {
  lesson = 'lesson',
  channel = 'channel',
}
