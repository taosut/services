import { forwardRef, Module } from '@nestjs/common';
import { PaymentModule } from '../payment/payment.module';
import { HashService } from './hash.service';
import { MidtransController } from './midtrans.controller';
import { MidtransService } from './midtrans.service';
import { MidtransNotificationService } from './midtransNotification.service';

@Module({
  imports: [forwardRef(() => PaymentModule)],
  providers: [MidtransService, MidtransNotificationService, HashService],
  controllers: [MidtransController],
  exports: [MidtransService],
})
export class MidtransModule {}
