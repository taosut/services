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
import { FileStorageService } from '../src/fileStorage/fileStorage.service';
import { MidtransModule } from '../src/midtrans/midtrans.module';
import { EPaymentStatus } from '../src/payment/interfaces/payment.enum';
import { InvoiceService } from '../src/payment/invoice.service';
import { PaymentController } from '../src/payment/payment.controller';
import { Payment } from '../src/payment/payment.entity';
import { PaymentModule } from '../src/payment/payment.module';
import { PaymentService } from '../src/payment/payment.service';
import { UserService } from '../src/payment/user.service';
import { paymentManualSeed } from './mock';

describe('Testing Manual Payment', () => {
  let app: INestApplication;

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

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Payment],
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
        FileStorageService,
      ],
      controllers: [PaymentController],
      exports: [PaymentService],
    })
      .overrideProvider(UserService)
      .useValue(userService)
      .overrideProvider(InvoiceService)
      .useValue(invoiceService)
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

  it(`POST /payment to create manual payment`, () => {
    return request(app.getHttpServer())
      .post('/payment')
      .send(paymentManualSeed)
      .set('Accept', 'application/json')
      .expect(201)
      .then(({ body }) => {
        expect(body.id).toBe(paymentManualSeed.id);
      });
  });

  it(`GET /payment/${paymentManualSeed.id} to fetch created manual payment`, () => {
    return request(app.getHttpServer())
      .get(`/payment/${paymentManualSeed.id}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBe(paymentManualSeed.id);
      });
  });

  it(`POST /payment/receipt/${paymentManualSeed.id} to update manual payment with transfer receipt file`, async () => {
    return request(app.getHttpServer())
      .post(`/payment/receipt/${paymentManualSeed.id}`)
      .attach('file', __dirname + '/images/image01.png')
      .expect(201)
      .then(({ body }) => {
        expect(body.transactionDocument);
        expect(body.status).toBe(EPaymentStatus.REVIEWING);
      });
  });

  it(`POST /payment/approve/${paymentManualSeed.id} to approve manual payment`, async () => {
    return request(app.getHttpServer())
      .post(`/payment/approve/${paymentManualSeed.id}`)
      .expect(201)
      .then(({ body }) => {
        expect(body.status).toBe(EPaymentStatus.SETTLED);
      });
  });

  it(`DELETE /payment/receipt/${paymentManualSeed.id} to delete payment receipt`, () => {
    return request(app.getHttpServer())
      .delete(`/payment/receipt/${paymentManualSeed.id}`)
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(body.transactionDocument).toBeNull();
      });
  });

  it(`DELETE /payment/${paymentManualSeed.id} to delete created payment`, () => {
    return request(app.getHttpServer())
      .delete(`/payment/${paymentManualSeed.id}`)
      .set('Accept', 'application/json')
      .expect(200);
  });

  it(`GET /payment/${paymentManualSeed.id} to fetch deleted payment`, () => {
    return request(app.getHttpServer())
      .get(`/payment/${paymentManualSeed.id}`)
      .expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
