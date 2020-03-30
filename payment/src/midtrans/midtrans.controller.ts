import { ExceptionHandler } from '@magishift/util';
import { Body, Controller, Post } from '@nestjs/common';
import { MIDTRANS_ENDPOINT } from './interfaces/midtrans.const';
import { ITransferStatusResponse } from './interfaces/midtrans.interface';
import { MidtransNotificationService } from './midtransNotification.service';

@Controller(MIDTRANS_ENDPOINT)
export class MidtransController {
  constructor(readonly notificationService: MidtransNotificationService) {}

  @Post('/notification')
  async notificationMidtrans(
    @Body() data: ITransferStatusResponse,
  ): Promise<void> {
    try {
      const response = await this.notificationService.handleMidtransNotification(
        data,
      );
      return response;
    } catch (e) {
      ExceptionHandler(e);
    }
  }
}
