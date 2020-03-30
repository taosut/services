import { ErrorFilter } from '@magishift/util';
import { HttpModule, INestApplication, Logger, ValidationPipe } from '@nestjs/common';
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
import { paymentBankTransferBCASeed, signatureKey } from './mock';

describe('Testing Payment Bank Transfer', () => {
  let app: INestApplication;

  let paymentData = paymentBankTransferBCASeed as IPayment;

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
    bankTransfer: () => {
      return {
        status_code: '201',
        status_message: 'Success, Bank Transfer transaction is created',
        transaction_id: '9aed5972-5b6a-401e-894b-a32c91ed1a3a',
        order_id: '1466323342',
        gross_amount: '20000.00',
        payment_type: 'bank_transfer',
        transaction_time: '2016-06-19 15:02:22',
        transaction_status: 'pending',
        va_numbers: [
          {
            bank: 'bca',
            va_number: '91019021579',
          },
        ],
        fraud_status: 'accept',
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
        FileStorageModule,
        HttpModule,
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

  it(`POST /payment to create payment with bank transfer bca`, () => {
    return request(app.getHttpServer())
      .post('/payment')
      .send(paymentBankTransferBCASeed)
      .set('Accept', 'application/json')
      .expect(201)
      .then(({ body }) => {
        expect(body.id).toBe(paymentBankTransferBCASeed.id);
      });
  });

  it(`GET /payment/${paymentBankTransferBCASeed.id} to fetch created payment with bank transfer bca`, () => {
    return request(app.getHttpServer())
      .get(`/payment/${paymentBankTransferBCASeed.id}`)
      .expect(200)
      .then(({ body }) => {
        paymentData = body;
        expect(body.id).toBe(paymentBankTransferBCASeed.id);
      });
  });

  it(`POST /midtrans/notification to update payment ${paymentBankTransferBCASeed.id}  to settled`, async () => {
    const grossAmount = parseInt(paymentData.grossAmount, 10);
    const midtransBankTransferNotification = {
      status_code: '201',
      status_message: 'midtrans payment notification',
      transaction_id: paymentData.midtransTransactionId,
      order_id: paymentData.paymentNumber,
      gross_amount: paymentData.grossAmount,
      payment_type: 'bank_transfer',
      transaction_time: paymentData.midtransTransactionTime,
      transaction_status: EMidtransStatus.settlement,
      fraud_status: 'accept',
      va_numbers: [
        {
          bank: 'bca',
          va_number: paymentData.vaNumber,
        },
      ],
      signature_key: await signatureKey(
        paymentData.paymentNumber,
        'bank_transfer',
        grossAmount
      ),
    };

    return request(app.getHttpServer())
      .post(`/midtrans/notification`)
      .send(midtransBankTransferNotification)
      .set('Accept', 'application/json')
      .expect(201);
  });

  it(`GET /payment/${paymentBankTransferBCASeed.id} to fetch updated payment`, () => {
    return request(app.getHttpServer())
      .get(`/payment/${paymentBankTransferBCASeed.id}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.status).toBe(EPaymentStatus.SETTLED);
      });
  });

  it(`DELETE /payment/${paymentBankTransferBCASeed.id} to delete created payment`, () => {
    return request(app.getHttpServer())
      .delete(`/payment/${paymentBankTransferBCASeed.id}`)
      .set('Accept', 'application/json')
      .expect(200);
  });

  it(`GET /payment/${paymentBankTransferBCASeed.id} to fetch deleted payment`, () => {
    return request(app.getHttpServer())
      .get(`/payment/${paymentBankTransferBCASeed.id}`)
      .expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
