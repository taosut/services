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
import { Payment } from '../src/payment/payment.entity';
import { PaymentModule } from '../src/payment/payment.module';
import { OrganizationService } from '../src/paymentZenpres/organization.service';
import { PaymentZenpresController } from '../src/paymentZenpres/paymentZenpres.controller';
import { PaymentZenpres } from '../src/paymentZenpres/paymentZenpres.entity';
import { PaymentZenpresModule } from '../src/paymentZenpres/paymentZenpres.module';
import { PaymentZenpresService } from '../src/paymentZenpres/paymentZenpres.service';
import { paymentZenpresManualSeed } from './mock';

describe('Testing Manual Payment Zenpres', () => {
  let app: INestApplication;

  const organizationService = {
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
          entities: [PaymentZenpres, Payment],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([PaymentZenpres]),
        PaymentZenpresModule,
        MidtransModule,
        HttpModule,
        FileStorageModule,
      ],
      providers: [
        PaymentModule,
        PaymentZenpresService,
        OrganizationService,
        InvoiceService,
        FileStorageService,
      ],
      controllers: [PaymentZenpresController],
      exports: [PaymentZenpresService],
    })
      .overrideProvider(OrganizationService)
      .useValue(organizationService)
      .overrideProvider(InvoiceService)
      .useValue(invoiceService)
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new ErrorFilter(Logger));

    await app.init();
  });

  it(`GET /paymentZenpres to fetch payment list`, () => {
    return request(app.getHttpServer())
      .get('/paymentZenpres')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
      });
  });

  it(`POST /paymentZenpres to create manual payment`, () => {
    return request(app.getHttpServer())
      .post('/paymentZenpres')
      .send(paymentZenpresManualSeed)
      .set('Accept', 'application/json')
      .expect(201)
      .then(({ body }) => {
        expect(body.id).toBe(paymentZenpresManualSeed.id);
      });
  });

  it(`GET /paymentZenpres/${paymentZenpresManualSeed.id} to fetch created manual payment`, () => {
    return request(app.getHttpServer())
      .get(`/paymentZenpres/${paymentZenpresManualSeed.id}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBe(paymentZenpresManualSeed.id);
      });
  });

  it(`POST /paymentZenpres/receipt/${paymentZenpresManualSeed.id} to update manual payment with transfer receipt file`, async () => {
    return request(app.getHttpServer())
      .post(`/paymentZenpres/receipt/${paymentZenpresManualSeed.id}`)
      .attach('file', __dirname + '/images/image01.png')
      .expect(201)
      .then(({ body }) => {
        expect(body.transactionDocument);
        expect(body.status).toBe(EPaymentStatus.REVIEWING);
      });
  });

  it(`POST /paymentZenpres/approve/${paymentZenpresManualSeed.id} to approve manual payment`, async () => {
    return request(app.getHttpServer())
      .post(`/paymentZenpres/approve/${paymentZenpresManualSeed.id}`)
      .expect(201)
      .then(({ body }) => {
        expect(body.status).toBe(EPaymentStatus.SETTLED);
      });
  });

  it(`DELETE /paymentZenpres/receipt/${paymentZenpresManualSeed.id} to delete payment receipt`, () => {
    return request(app.getHttpServer())
      .delete(`/paymentZenpres/receipt/${paymentZenpresManualSeed.id}`)
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(body.transactionDocument).toBeNull();
      });
  });

  it(`DELETE /paymentZenpres/${paymentZenpresManualSeed.id} to delete created payment`, () => {
    return request(app.getHttpServer())
      .delete(`/paymentZenpres/${paymentZenpresManualSeed.id}`)
      .set('Accept', 'application/json')
      .expect(200);
  });

  it(`GET /paymentZenpres/${paymentZenpresManualSeed.id} to fetch deleted payment`, () => {
    return request(app.getHttpServer())
      .get(`/paymentZenpres/${paymentZenpresManualSeed.id}`)
      .expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
