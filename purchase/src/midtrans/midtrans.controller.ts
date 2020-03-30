import { ExceptionHandler } from '@magishift/util';
import { Body, Controller, Post } from '@nestjs/common';
import { MIDTRANS_ENDPOINT } from './interfaces/midtrans.const';
import { ITransferStatusResponse } from './interfaces/midtrans.interface';
import { MidtransService } from './midtrans.service';

@Controller(MIDTRANS_ENDPOINT)
export class MidtransController {
  constructor(readonly service: MidtransService) {}

  @Post('/notification')
  async notificationMidtrans(@Body() data: ITransferStatusResponse) {
    try {
      return this.service.handleMidtransNotification(data);
    } catch (e) {
      ExceptionHandler(e);
    }
  }
}
