import { ApiModelProperty } from '@nestjs/swagger';
import {
  EBankType,
  EPaymentMethod,
  EPaymentStatus,
  EStoreName,
} from './paymentZenpres.enum';

export abstract class IPaymentZenpresPayload {
  id?: string;

  @ApiModelProperty()
  invoiceId: string;

  @ApiModelProperty()
  organizationId: string;

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
