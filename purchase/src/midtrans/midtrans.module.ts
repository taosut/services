import { Module, forwardRef } from '@nestjs/common';
import { MidtransController } from './midtrans.controller';
import { MidtransService } from './midtrans.service';
import { PurchaseModule } from '../purchase/purchase.module';

@Module({
  imports: [forwardRef(() => PurchaseModule)],
  providers: [MidtransService],
  controllers: [MidtransController],
  exports: [MidtransService],
})
export class MidtransModule {}
