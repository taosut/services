import { ApiModelProperty } from '@nestjs/swagger';
import {
  EBankType,
  EPaymentMethod,
  EPaymentStatus,
  EStoreName,
} from './payment.enum';

export abstract class IPaymentPayload {
  id?: string;

  @ApiModelProperty()
  invoiceId: string;

  @ApiModelProperty()
  userId: string;

  @ApiModelProperty()
  paymentAmount: number;

  @ApiModelProperty()
  paymentMethod: EPaymentMethod;

  @ApiModelProperty()
  bankTransferType?: EBankType;

  @ApiModelProperty()
  transactionDocument?: string;

  @ApiModelProperty()
  gopayCallbackUrl?: string;

  @ApiModelProperty()
  storeName?: EStoreName;

  @ApiModelProperty()
  message?: string;

  paymentNumber?: string;

  status?: EPaymentStatus;
}
