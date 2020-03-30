import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { midtransConfig } from './midtrans.config';

@Injectable()
export class HashService {
  async hash(
    paymentId: string,
    paymentType: string,
    grossAmount: number,
  ): Promise<string> {
    const hash = crypto.createHash('sha512');
    await hash.update(
      '' + paymentId + paymentType + grossAmount + midtransConfig.serverKey,
    );
    const signatureKey = await hash.digest('hex');

    return signatureKey;
  }
}
