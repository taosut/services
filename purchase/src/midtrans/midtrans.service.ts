import { HttpException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import {
  IBankTransferResponse,
  ITransferRequest,
  ITransferStatusResponse,
} from './interfaces/midtrans.interface';
import midtrans, { midtransConfig } from './midtrans.config';
import { EBankTransferMethod } from './interfaces/midtrans.const';
import { IPurchase } from '../purchase/interfaces/purchase.interface';
import { PurchaseService } from '../purchase/purchase.service';

@Injectable()
export class MidtransService {
  constructor(private readonly purchaseService: PurchaseService) {}

  async bankTransfer(purchase: IPurchase): Promise<IBankTransferResponse> {
    const hash = crypto.createHash('sha512');
    const parameter: ITransferRequest = {
      transaction_details: {
        gross_amount: purchase.totalPrices,
        order_id: purchase.id,
      },
      // custom_expiry: {
      //   expiry_duration: midtransConfig.expiry_duration,
      //   unit: 'hour',
      //   order_time: purchase.createdAt,
      // } as ICustomExpiry,
    } as any;
    // parameter.customer_details = ({
    //   email: purchase.buyerEmail,
    //   first_name: purchase.buyerName,
    //   phone: purchase.buyerPhoneNumber,
    // } as any) as ICustomerDetails;

    switch (purchase.paymentMethod) {
      case EBankTransferMethod.BCA:
        parameter.payment_type = 'bank_transfer';
        parameter.bank_transfer = {
          bank: 'bca',
        } as any;
        break;
      case EBankTransferMethod.BNI:
        parameter.payment_type = 'bank_transfer';
        parameter.bank_transfer = {
          bank: 'bni',
        } as any;
        break;
      case EBankTransferMethod.Permata:
        parameter.payment_type = 'bank_transfer';
        parameter.bank_transfer = {
          bank: 'permata',
        } as any;
        break;
      case EBankTransferMethod.Mandiri:
        parameter.payment_type = 'echannel';
        parameter.echannel = {
          bill_info1: 'Payment For:',
          bill_info2: 'Zenius Membership',
        } as any;
        break;
    }

    await hash.update(
      '' +
        parameter.transaction_details.order_id +
        parameter.payment_type +
        parameter.transaction_details.gross_amount +
        midtransConfig.serverKey,
    );
    parameter.signature_key = await hash.digest('hex');

    const result = await midtrans
      .charge(parameter)
      .then((chargeResponse: IBankTransferResponse) => {
        return chargeResponse;
      })
      .catch(({ ApiResponse }: any) => {
        throw new HttpException(
          ApiResponse.status_message,
          ApiResponse.status_code,
        );
      });

    if (result) {
      const purchasePayload = ({
        transactionId: result.transaction_id,
        transactionTime: result.transaction_time,
        status: result.transaction_status,
        vaNumber: result.vaNumber,
        billerCode: result.billerCode,
        billerKey: result.billerKey,
      } as any) as IPurchase;
      await this.purchaseService.update(purchase.id, purchasePayload);
    }

    return result;
  }

  // TO DO : Cancel Bank Transfer
  // async cancelBankTransfer(): Promise<any> {}

  // TO DO : Fix Fetch Data Below
  async handleMidtransNotification(
    data: ITransferStatusResponse,
  ): Promise<any> {
    const serverKey = midtransConfig.serverKey;
    const grossAmount = parseInt(data.gross_amount, 10);
    const hash = crypto.createHash('sha512');
    await hash.update(
      '' + data.order_id + data.payment_type + grossAmount + serverKey,
    );
    const signatureKey = await hash.digest('hex');
    if (signatureKey !== data.signature_key) {
      throw new HttpException('Invalid Signature Key', 400);
    }
    if (data.status_code === '200') {
      const purchaseData = await this.purchaseService.fetch(
        data.transaction_id,
      );
      purchaseData.status = data.transaction_status;
      await this.purchaseService.update(data.transaction_id, purchaseData);
    }

    return { message: data.status_message, code: data.status_code };
  }
}
