import { ApiModelProperty } from '@nestjs/swagger';
// import { IGopayAction } from '../../midtrans/interfaces/midtrans.interface';
import {
  EBankType,
  EPaymentMethod,
  EPaymentStatus,
  EStoreName,
} from './payment.enum';

export abstract class IPayment {
  @ApiModelProperty()
  id: string;

  @ApiModelProperty()
  invoiceId: string;

  @ApiModelProperty()
  paymentNumber: string;

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
  midtransTransactionId: string;

  @ApiModelProperty()
  midtransTransactionTime: string;

  @ApiModelProperty()
  status: EPaymentStatus;

  @ApiModelProperty()
  midtransStatus: string;

  @ApiModelProperty()
  vaNumber?: string;

  @ApiModelProperty()
  billerCode?: string;

  @ApiModelProperty()
  billKey?: string;

  @ApiModelProperty()
  gopayAction?: string;

  @ApiModelProperty()
  storeName?: EStoreName;

  @ApiModelProperty()
  cStorePaymentCode?: string;

  @ApiModelProperty()
  message?: string;

  @ApiModelProperty()
  grossAmount?: string;

  @ApiModelProperty()
  statusUpdatedAt?: Date;

  @ApiModelProperty()
  createdAt: Date;

  @ApiModelProperty()
  updatedAt: Date;
}
