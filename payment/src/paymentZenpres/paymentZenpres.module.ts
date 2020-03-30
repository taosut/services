import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileStorageModule } from '../fileStorage/fileStorage.module';
import { MidtransModule } from '../midtrans/midtrans.module';
import { InvoiceService } from './invoice.service';
import { OrganizationService } from './organization.service';
import { PaymentZenpresController } from './paymentZenpres.controller';
import { PaymentZenpres } from './paymentZenpres.entity';
import { PaymentZenpresService } from './paymentZenpres.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentZenpres]),
    forwardRef(() => MidtransModule),
    FileStorageModule,
  ],
  providers: [PaymentZenpresService, OrganizationService, InvoiceService],
  controllers: [PaymentZenpresController],
  exports: [PaymentZenpresService],
})
export class PaymentZenpresModule {}
