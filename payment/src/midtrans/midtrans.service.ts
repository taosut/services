import { HttpException, Injectable } from '@nestjs/common';
import { EBankType, EStoreName } from '../payment/interfaces/payment.enum';
import { IPayment } from '../payment/interfaces/payment.interface';
import { IPaymentZenpres } from '../paymentZenpres/interfaces/paymentZenpres.interface';
import { HashService } from './hash.service';
import {
  IBankTransferResponse,
  ICstoreResponse,
  IGopayResponse,
  ITransferRequest,
} from './interfaces/midtrans.interface';
import midtrans from './midtrans.config';

@Injectable()
export class MidtransService {
  constructor(private readonly hashService: HashService) {}
  async bankTransfer(
    payment: IPayment | IPaymentZenpres,
  ): Promise<IBankTransferResponse> {
    const parameter: ITransferRequest = {
      transaction_details: {
        gross_amount: payment.paymentAmount,
        order_id: payment.id,
      },
    } as any;

    switch (payment.bankTransferType) {
      case EBankType.BCA:
        parameter.payment_type = 'bank_transfer';
        parameter.bank_transfer = {
          bank: 'bca',
        } as any;
        break;
      case EBankType.BNI:
        parameter.payment_type = 'bank_transfer';
        parameter.bank_transfer = {
          bank: 'bni',
        } as any;
        break;
      case EBankType.PERMATA:
        parameter.payment_type = 'bank_transfer';
        parameter.bank_transfer = {
          bank: 'permata',
        } as any;
        break;
      case EBankType.MANDIRI:
        parameter.payment_type = 'echannel';
        parameter.echannel = {
          bill_info1: 'Payment For:',
          bill_info2: 'Zenius Membership',
        } as any;
        break;
    }
    parameter.signature_key = await this.hashService.hash(
      parameter.transaction_details.order_id,
      parameter.payment_type,
      parameter.transaction_details.gross_amount,
    );

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

    return result;
  }

  // TO DO : Cancel Bank Transfer
  // async cancelBankTransfer(): Promise<any> {}

  async gopay(payment: IPayment | IPaymentZenpres): Promise<IGopayResponse> {
    const parameter: ITransferRequest = {
      payment_type: 'gopay',
      transaction_details: {
        gross_amount: payment.paymentAmount,
        order_id: payment.id,
      },
    } as any;
    if (payment.gopayCallbackUrl) {
      parameter.gopay = {
        callback_url: payment.gopayCallbackUrl,
        enable_callback: true,
      };
    }
    parameter.signature_key = await this.hashService.hash(
      parameter.transaction_details.order_id,
      parameter.payment_type,
      parameter.transaction_details.gross_amount,
    );

    const result = await midtrans
      .charge(parameter)
      .then((chargeResponse: IGopayResponse) => {
        return chargeResponse;
      })
      .catch(({ ApiResponse }: any) => {
        throw new HttpException(
          ApiResponse.status_message,
          ApiResponse.status_code,
        );
      });
    return result;
  }

  async cstore(payment: IPayment | IPaymentZenpres): Promise<ICstoreResponse> {
    const parameter: ITransferRequest = {
      payment_type: 'cstore',
      transaction_details: {
        gross_amount: payment.paymentAmount,
        order_id: payment.id,
      },
    } as any;
    if (payment.storeName === EStoreName.alfamart) {
      parameter.cstore = {
        store: EStoreName.alfamart,
        alfamart_free_text_1: 'Zenius Membership Payment',
        alfamart_free_text_2: `payment number: ${payment.paymentNumber}`,
        alfamart_free_text_3: payment.message,
      };
    } else if (payment.storeName === EStoreName.indomaret) {
      parameter.cstore = {
        store: EStoreName.indomaret,
        message: `Zenius Membership Payment. ${payment.message}`,
      };
    }
    parameter.signature_key = await this.hashService.hash(
      parameter.transaction_details.order_id,
      parameter.payment_type,
      parameter.transaction_details.gross_amount,
    );

    const result = await midtrans
      .charge(parameter)
      .then((chargeResponse: ICstoreResponse) => {
        return chargeResponse;
      })
      .catch(({ ApiResponse }: any) => {
        throw new HttpException(
          ApiResponse.status_message,
          ApiResponse.status_code,
        );
      });

    return result;
  }
}
