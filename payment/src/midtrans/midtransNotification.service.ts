import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { PaymentService } from '../payment/payment.service';
import { HashService } from './hash.service';
import { ITransferStatusResponse } from './interfaces/midtrans.interface';

@Injectable()
export class MidtransNotificationService {
  constructor(
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
    private readonly hashService: HashService,
  ) {}
  async handleMidtransNotification(
    data: ITransferStatusResponse,
  ): Promise<any> {
    const grossAmount = parseInt(data.gross_amount, 10);
    const signatureKey = await this.hashService.hash(
      data.order_id,
      data.payment_type,
      grossAmount,
    );
    if (signatureKey !== data.signature_key) {
      throw new HttpException('Invalid Signature Key', 400);
    }
    const paymentData = await this.paymentService.findByTransactionId(
      data.transaction_id,
    );
    paymentData.midtransStatus = data.transaction_status;
    await this.paymentService.updatePaymentStatus(
      data.transaction_id,
      data.transaction_status,
    );

    return { message: 'success', code: 201 };
  }
}
