import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileStorageModule } from '../fileStorage/fileStorage.module';
import { MidtransModule } from '../midtrans/midtrans.module';
import { InvoiceService } from './invoice.service';
import { PaymentController } from './payment.controller';
import { Payment } from './payment.entity';
import { PaymentService } from './payment.service';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    forwardRef(() => MidtransModule),
    FileStorageModule,
  ],
  providers: [PaymentService, UserService, InvoiceService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
