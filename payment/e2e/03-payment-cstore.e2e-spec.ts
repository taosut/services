import { ErrorFilter } from '@magishift/util';
import {
  HttpModule,
  INestApplication,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import uuid = require('uuid');
import { FileStorageModule } from '../src/fileStorage/fileStorage.module';
import { HashService } from '../src/midtrans/hash.service';
import { EMidtransStatus } from '../src/midtrans/interfaces/midtrans.enum';
import { MidtransModule } from '../src/midtrans/midtrans.module';
import { MidtransService } from '../src/midtrans/midtrans.service';
import { MidtransNotificationService } from '../src/midtrans/midtransNotification.service';
import { EPaymentStatus } from '../src/payment/interfaces/payment.enum';
import { IPayment } from '../src/payment/interfaces/payment.interface';
import { InvoiceService } from '../src/payment/invoice.service';
import { PaymentController } from '../src/payment/payment.controller';
import { Payment } from '../src/payment/payment.entity';
import { PaymentModule } from '../src/payment/payment.module';
import { PaymentService } from '../src/payment/payment.service';
import { UserService } from '../src/payment/user.service';
import { PaymentZenpres } from '../src/paymentZenpres/paymentZenpres.entity';
import { paymentCstoreSeed, signatureKey } from './mock';

describe('Testing Payment CStore', () => {
  let app: INestApplication;

  let paymentData = paymentCstoreSeed as IPayment;

  const userService = {
    findById: () => {
      return {
        data: { id: uuid() },
      };
    },
  };

  const invoiceService = {
    findById: () => {
      return {
        data: { id: uuid() },
      };
    },
  };

  const midtransService = {
    cstore: () => {
      return {
        status_code: '201',
        status_message: 'Success, cstore transaction is successful',
        transaction_id: 'e3f0b1b5-1941-4ffb-9083-4ee5a96d878a',
        order_id: 'order04',
        gross_amount: '162500.00',
        payment_type: 'cstore',
        transaction_time: '2016-06-19 17:18:07',
        transaction_status: 'pending',
        payment_code: '25709650945026',
      };
    },
    hash: () => {
      return '';
    },
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Payment, PaymentZenpres],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Payment]),
        PaymentModule,
        MidtransModule,
        HttpModule,
        FileStorageModule,
      ],
      providers: [
        PaymentService,
        UserService,
        InvoiceService,
        MidtransService,
        MidtransNotificationService,
        HashService,
      ],
      controllers: [PaymentController],
      exports: [PaymentService],
    })
      .overrideProvider(UserService)
      .useValue(userService)
      .overrideProvider(InvoiceService)
      .useValue(invoiceService)
      .overrideProvider(MidtransService)
      .useValue(midtransService)
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new ErrorFilter(Logger));

    await app.init();
  });

  it(`GET /payment to fetch payment list`, () => {
    return request(app.getHttpServer())
      .get('/payment')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
      });
  });

  it(`POST /payment to create payment with cstore (alfamart)`, () => {
    return request(app.getHttpServer())
      .post('/payment')
      .send(paymentCstoreSeed)
      .set('Accept', 'application/json')
      .expect(201)
      .then(({ body }) => {
        expect(body.id).toBe(paymentCstoreSeed.id);
      });
  });

  it(`GET /payment/${paymentCstoreSeed.id} to fetch created payment with cstore (alfamart)`, () => {
    return request(app.getHttpServer())
      .get(`/payment/${paymentCstoreSeed.id}`)
      .expect(200)
      .then(({ body }) => {
        paymentData = body;
        expect(body.id).toBe(paymentCstoreSeed.id);
      });
  });

  it(`POST /midtrans/notification to update payment ${paymentCstoreSeed.id}  to settled`, async () => {
    const grossAmount = parseInt(paymentData.grossAmount, 10);
    const midtransBankTransferNotification = {
      status_code: '200',
      status_message: 'midtrans payment notification',
      transaction_id: paymentData.midtransTransactionId,
      order_id: paymentData.paymentNumber,
      gross_amount: paymentData.grossAmount,
      payment_type: 'cstore',
      transaction_time: paymentData.midtransTransactionTime,
      transaction_status: EMidtransStatus.settlement,
      signature_key: await signatureKey(
        paymentData.paymentNumber,
        'cstore',
        grossAmount
      ),
    };

    return request(app.getHttpServer())
      .post(`/midtrans/notification`)
      .send(midtransBankTransferNotification)
      .set('Accept', 'application/json')
      .expect(201);
  });

  it(`GET /payment/${paymentCstoreSeed.id} to fetch updated payment`, () => {
    return request(app.getHttpServer())
      .get(`/payment/${paymentCstoreSeed.id}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.status).toBe(EPaymentStatus.SETTLED);
      });
  });

  it(`DELETE /payment/${paymentCstoreSeed.id} to delete created payment`, () => {
    return request(app.getHttpServer())
      .delete(`/payment/${paymentCstoreSeed.id}`)
      .set('Accept', 'application/json')
      .expect(200);
  });

  it(`GET /payment/${paymentCstoreSeed.id} to fetch deleted payment`, () => {
    return request(app.getHttpServer())
      .get(`/payment/${paymentCstoreSeed.id}`)
      .expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
