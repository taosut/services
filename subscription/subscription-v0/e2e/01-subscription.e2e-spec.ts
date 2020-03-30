import { ErrorFilter } from '@magishift/util';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { Subscription } from '../src/subscription/subscription.entity';
import { ormconfig } from './ormconfig';

describe('SubscriptionController (e2e)', () => {
  let app: INestApplication;

  const subscriptionData: Partial<Subscription> = {
    account_id: 'a126346f-b088-4107-ab9a-7673674afdd5',
    payment_id: '5dfa57f3-ee4b-4961-b240-1ee714e126c1',
    start: new Date(),
    expired: new Date('2019-12-30'),
    active: true,
  };

  const patchSubscriptionData: Partial<Subscription> = {
    expired: new Date('2020-01-01'),
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule(ormconfig).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new ErrorFilter(Logger));
    await app.init();
  });

  let id: string;
  let accountId: string;

  it('/GET /subscriptions', async () => {
    return await request(app.getHttpServer())
      .get('/subscriptions')
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
      });
  });

  it('/POST /subscriptions', async () => {
    return await request(app.getHttpServer())
      .post('/subscriptions')
      .set('Accept', 'application/json')
      .send(subscriptionData)
      .expect(201)
      .then(({ body }) => {
        expect(body.account_id).toBeDefined();
        accountId = body.account_id;

      });
  });

  it('/GET /subscriptions/check/{account_id}', async () => {
    return await request(app.getHttpServer())
      .get('/subscriptions/check/' + accountId)
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
        id = body.id;
      });
  });

  it('/GET /subscriptions/{id}', async () => {
    return await request(app.getHttpServer())
      .get('/subscriptions/' + id)
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeDefined();
      });
  });

  it('/PATCH /subscriptions/{id}', async () => {
    return await request(app.getHttpServer())
      .patch('/subscriptions/' + id)
      .set('Accept', 'application/json')
      .send(patchSubscriptionData)
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeDefined();
      });
  });

  it('/PUT /subscriptions/{Id}', async () => {
    return await request(app.getHttpServer())
      .put('/subscriptions/' + id)
      .set('Accept', 'application/json')
      .send(subscriptionData)
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeDefined();
      });
  });

  it('/DELETE /subscriptions/{id}', async () => {
    return await request(app.getHttpServer())
      .delete('/subscriptions/' + id)
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeDefined();
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
