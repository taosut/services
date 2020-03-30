import * as crypto from 'crypto';
import uuid = require('uuid');
import { midtransConfig } from '../src/midtrans/midtrans.config';
import {
  EBankType,
  EPaymentMethod,
  EStoreName,
} from '../src/payment/interfaces/payment.enum';
import { IPaymentPayload } from '../src/payment/interfaces/paymentPayload.interface';
import { IPaymentZenpresPayload } from '../src/paymentZenpres/interfaces/paymentPayloadZenpres.interface';

export const updatedName: string = 'updated_product_name';
export const updatedStatus: string = 'active';
export const transactionId: string = uuid();
export const transactionTime: string = new Date().toISOString();
export const paymentBankTransferBCASeed: IPaymentPayload = {
  id: uuid(),
  invoiceId: uuid(),
  userId: uuid(),
  paymentAmount: 145000,
  paymentMethod: EPaymentMethod.BANK_TRANSFER,
  bankTransferType: EBankType.BCA,
};

export const paymentGOPAYSeed: IPaymentPayload = {
  id: uuid(),
  invoiceId: uuid(),
  userId: uuid(),
  paymentAmount: 145000,
  paymentMethod: EPaymentMethod.GOPAY,
  gopayCallbackUrl: 'zenius://callback',
};

export const paymentCstoreSeed: IPaymentPayload = {
  id: uuid(),
  invoiceId: uuid(),
  userId: uuid(),
  paymentAmount: 145000,
  paymentMethod: EPaymentMethod.CSTORE,
  storeName: EStoreName.indomaret,
  message: 'Testing Zenius Membership Payment',
};

export const paymentManualSeed: IPaymentPayload = {
  id: uuid(),
  invoiceId: uuid(),
  userId: uuid(),
  paymentAmount: 145000,
  paymentMethod: EPaymentMethod.MANUAL,
};

export const paymentZenpresManualSeed: IPaymentZenpresPayload = {
  id: uuid(),
  invoiceId: uuid(),
  organizationId: uuid(),
  paymentAmount: 145000,
  paymentMethod: EPaymentMethod.MANUAL,
};

export const signatureKey = async (
  paymentId: string,
  paymentType: string,
  grossAmount: number,
) => {
  const hash = crypto.createHash('sha512');
  await hash.update(
    '' + paymentId + paymentType + grossAmount + midtransConfig.serverKey,
  );
  const result = await hash.digest('hex');

  return result;
};
