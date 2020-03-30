import { ApiModelProperty } from '@nestjs/swagger';

export class InvoiceClient {
  @ApiModelProperty()
  influencerReferralCodeId: string;

  @ApiModelProperty()
  userId: string;

  @ApiModelProperty()
  productId: string;

  @ApiModelProperty()
  number: string;

  @ApiModelProperty()
  description: string;

  @ApiModelProperty()
  amount: number;

  @ApiModelProperty()
  discount: number;

  @ApiModelProperty()
  tax: number;

  @ApiModelProperty()
  totalAmount: number;

  @ApiModelProperty()
  status: string;

  @ApiModelProperty()
  issuedAt: Date;

  @ApiModelProperty()
  paidAt: Date;

  @ApiModelProperty()
  reviewedAt: Date;

  @ApiModelProperty()
  approvedAt: Date;

  @ApiModelProperty()
  cancelledAt: Date;
}
