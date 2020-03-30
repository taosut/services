import { ErrorFilter } from '@magishift/util';
import {
  HttpModule,
  INestApplication,
  Logger,
  ValidationPipe
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { entities } from '../src/entities';
import { SmsConfigurationController } from '../src/smsConfiguration/smsConfiguration.controller';
import { SmsConfiguration } from '../src/smsConfiguration/smsConfiguration.entity';
import { SmsConfigurationService } from '../src/smsConfiguration/smsConfiguration.service';
import { SmsOtpModule } from '../src/smsOtp/smsOtp.module';
import { otpConfigSeed } from './mock';

describe('Sms Otp', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities,
          synchronize: true,
        }),
        TypeOrmModule.forFeature([SmsConfiguration]),
        SmsOtpModule,
        HttpModule,
      ],
      providers: [SmsConfigurationService],
      controllers: [SmsConfigurationController],
      exports: [SmsConfigurationService],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new ErrorFilter(Logger));

    await app.init();
  });

  it(`GET /sms-configuration to fetch sub category list`, () => {
    return request(app.getHttpServer())
      .get('/sms-configuration')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body));
        expect(body.length).toBeGreaterThanOrEqual(0);
      });
  });

  // it(`POST /category to create category`, () => {
  //   return request(app.getHttpServer())
  //     .post('/category')
  //     .send(categorySeed)
  //     .set('Accept', 'application/json')
  //     .expect(201)
  //     .then(({ body }) => {
  //       expect(body.id).toEqual(categorySeed.id);
  //     });
  // });

  // it(`GET /category/${categorySeed.id} to fetch created category`, () => {
  //   return request(app.getHttpServer())
  //     .get(`/category/${categorySeed.id}`)
  //     .expect(200)
  //     .then(({ body }) => {
  //       expect(body.id).toEqual(categorySeed.id);
  //     });
  // });

  it(`POST /sms-configuration to create sms configuration`, () => {
    return request(app.getHttpServer())
      .post('/sms-configuration')
      .send(otpConfigSeed)
      .set('Accept', 'application/json')
      .expect(201)
      .then(({ body }) => {
        expect(body.id).toBe(otpConfigSeed.id);
      });
  });

  it(`GET /sms-configuration/${otpConfigSeed.id} to fetch created sub category`, () => {
    return request(app.getHttpServer())
      .get(`/sms-configuration/${otpConfigSeed.id}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBe(otpConfigSeed.id);
      });
  });

  it(`PATCH /sms-configuration/${otpConfigSeed.id} update created sub category`, () => {
    const updateData = otpConfigSeed;
    updateData.isActive = true;

    return request(app.getHttpServer())
      .patch(`/sms-configuration/${otpConfigSeed.id}`)
      .send(updateData)
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toEqual(otpConfigSeed.id);
      });
  });

  it(`GET /sms-configuration/${otpConfigSeed.id} to fetch updated sub category`, () => {
    return request(app.getHttpServer())
      .get(`/sms-configuration/${otpConfigSeed.id}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toEqual(otpConfigSeed.id);
      });
  });

  // it(`POST /sms-otp to create sms configuration`, () => {
  //   return request(app.getHttpServer())
  //     .post(`/sms-otp/send-otp/${otpPhone}`)
  //     .set('Accept', 'application/json')
  //     .expect(201)
  //     .then(({ body }) => {
  //       // tslint:disable-next-line:no-console
  //       console.log('KOK', body);
  //       // expect(body.id).toBe(otpConfigSeed.id);
  //     });
  // });

  it(`DELETE /sms-configuration/delete/${otpConfigSeed.id} delete created sub category`, () => {
    return request(app.getHttpServer())
      .delete(`/sms-configuration/${otpConfigSeed.id}`)
      .set('Accept', 'application/json')
      .expect(200);
  });

  it(`GET /sms-configuration/${otpConfigSeed.id} to fetch deleted sub category`, () => {
    return request(app.getHttpServer())
      .get(`/sms-configuration/${otpConfigSeed.id}`)
      .expect(404);
  });

  // it(`DELETE /category/delete/${
  //   categorySeed.id
  // } delete created category`, () => {
  //   return request(app.getHttpServer())
  //     .delete(`/category/${categorySeed.id}`)
  //     .set('Accept', 'application/json')
  //     .expect(200);
  // });

  // it(`GET /category/${categorySeed.id} to fetch deleted category`, () => {
  //   return request(app.getHttpServer())
  //     .get(`/category/${categorySeed.id}`)
  //     .expect(404);
  // });

  afterAll(async () => {
    await app.close();
  });
});
