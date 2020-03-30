import { ApiModelProperty } from '@nestjs/swagger';
import { IUser } from '../../user/interfaces/user.interface';
import { EProductType } from './membership.interface';

export abstract class IMembershipPayload {
  @ApiModelProperty()
  user: IUser;

  @ApiModelProperty()
  productId: string;

  @ApiModelProperty()
  productType: EProductType;

  @ApiModelProperty({ required: false })
  voucherId?: string;

  @ApiModelProperty({ required: false })
  status?: string;
}
