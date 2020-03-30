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
import { paymentGOPAYSeed, signatureKey } from './mock';

describe('Testing Payment GOPAY', () => {
  let app: INestApplication;

  let paymentData = paymentGOPAYSeed as IPayment;

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
    gopay: () => {
      return {
        status_code: '201',
        status_message: 'GO-PAY billing created',
        transaction_id: 'e48447d1-cfa9-4b02-b163-2e915d4417ac',
        order_id: 'SAMPLE-ORDER-ID-01',
        gross_amount: '10000.00',
        payment_type: 'gopay',
        transaction_time: '2017-10-04 12:00:00',
        transaction_status: 'pending',
        actions: [
          {
            name: 'generate-qr-code',
            method: 'GET',
            url:
              'https://api.midtrans.com/v2/gopay/e48447d1-cfa9-4b02-b163-2e915d4417ac/qr-code',
          },
          {
            name: 'deeplink-redirect',
            method: 'GET',
            url:
              // tslint:disable-next-line: max-line-length
              'gojek://gopay/merchanttransfer?tref=1509110800474199656LMVO&amount=10000&activity=GP:RR&callback_url=someapps://callback?order_id=SAMPLE-ORDER-ID-01',
          },
          {
            name: 'get-status',
            method: 'GET',
            url:
              'https://api.midtrans.com/v2/e48447d1-cfa9-4b02-b163-2e915d4417ac/status',
          },
          {
            name: 'cancel',
            method: 'POST',
            url:
              'https://api.midtrans.com/v2/e48447d1-cfa9-4b02-b163-2e915d4417ac/cancel',
            fields: [],
          },
        ],
        channel_response_code: '200',
        channel_response_message: 'Success',
        currency: 'IDR',
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

  it(`POST /payment to create payment with gopay`, () => {
    return request(app.getHttpServer())
      .post('/payment')
      .send(paymentGOPAYSeed)
      .set('Accept', 'application/json')
      .expect(201)
      .then(({ body }) => {
        expect(body.id).toBe(paymentGOPAYSeed.id);
      });
  });

  it(`GET /payment/${paymentGOPAYSeed.id} to fetch created payment with gopay`, () => {
    return request(app.getHttpServer())
      .get(`/payment/${paymentGOPAYSeed.id}`)
      .expect(200)
      .then(({ body }) => {
        paymentData = body;
        expect(body.id).toBe(paymentGOPAYSeed.id);
      });
  });

  it(`POST /midtrans/notification to update payment ${paymentGOPAYSeed.id}  to settled`, async () => {
    const grossAmount = parseInt(paymentData.grossAmount, 10);
    const midtransBankTransferNotification = {
      status_code: '200',
      status_message: 'midtrans payment notification',
      transaction_id: paymentData.midtransTransactionId,
      order_id: paymentData.paymentNumber,
      gross_amount: paymentData.grossAmount,
      payment_type: 'gopay',
      transaction_time: paymentData.midtransTransactionTime,
      transaction_status: EMidtransStatus.settlement,
      signature_key: await signatureKey(
        paymentData.paymentNumber,
        'gopay',
        grossAmount
      ),
    };

    return request(app.getHttpServer())
      .post(`/midtrans/notification`)
      .send(midtransBankTransferNotification)
      .set('Accept', 'application/json')
      .expect(201);
  });

  it(`GET /payment/${paymentGOPAYSeed.id} to fetch updated payment`, () => {
    return request(app.getHttpServer())
      .get(`/payment/${paymentGOPAYSeed.id}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.status).toBe(EPaymentStatus.SETTLED);
      });
  });

  it(`DELETE /payment/${paymentGOPAYSeed.id} to delete created payment`, () => {
    return request(app.getHttpServer())
      .delete(`/payment/${paymentGOPAYSeed.id}`)
      .set('Accept', 'application/json')
      .expect(200);
  });

  it(`GET /payment/${paymentGOPAYSeed.id} to fetch deleted payment`, () => {
    return request(app.getHttpServer())
      .get(`/payment/${paymentGOPAYSeed.id}`)
      .expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
