import { config } from 'dotenv';
const { parsed } = config();
process.env = { ...parsed, ...process.env };

import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import _ from 'lodash';
import randomstring = require('randomstring');
import request = require('supertest');
import { Account } from '../src/account/types/account.type';
import { AccountCredential } from '../src/account/types/accountCredential.type';
import { mainModuleFactory } from '../src/main.module';
import { ErrorFilter } from '../src/utils/error.util';

describe('Test Keycloak Account Service', () => {
  let app: INestApplication;

  const realmMain: string = process.env.KEYCLOAK_REALM_MAIN;

  const newAccount: Account = {
    username: 'AccountE2ETest',
    firstName: 'Test',
    lastName: '',
    email: 'AccountE2ETest@AccountE2ETest.com',
    enabled: true,
    emailVerified: true,
    credentials: [{ type: 'password', value: '1234' }],
  };

  let newAccountId: string;

  const accessToken: string = '';

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [mainModuleFactory(realmMain)],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new ErrorFilter(Logger));

    await app.init();
  });

  it(`GET /accounts  get all accounts`, () => {
    return request(app.getHttpServer())
      .get(`/accounts/`)
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThan(0);
      });
  });

  it(`POST /accounts create new account`, () => {
    return request(app.getHttpServer())
      .post(`/accounts/`)
      .send(newAccount)
      .set('Accept', 'application/json')
      .expect(201)
      .expect('Content-Type', /json/)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
        newAccountId = body.id;
      });
  });

  it(`GET /accounts :id get new created account`, () => {
    return request(app.getHttpServer())
      .get(`/accounts/${newAccountId}`)
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(({ body }) => {
        expect(body.id).toBe(newAccountId);
        expect(body.username).toBe(newAccount.username.toLowerCase());
      });
  });

  it(`GET /accounts :id get account by find By Username`, () =>
    request(app.getHttpServer())
      .get(`/accounts/find?username=${newAccount.username}`)
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(({ body }) => {
        expect(body.id).toBe(newAccountId);
        expect(body.username).toBe(newAccount.username.toLowerCase());
        expect(body.email).toBe(newAccount.email.toLowerCase());
      }));

  it(`GET /accounts :id get account by find By Email`, () =>
    request(app.getHttpServer())
      .get(`/accounts/find`)
      .query({
        email: newAccount.email,
      })
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(({ body }) => {
        expect(body.id).toBe(newAccountId);
        expect(body.username).toBe(newAccount.username.toLowerCase());
        expect(body.email).toBe(newAccount.email.toLowerCase());
      }));

  it(`GET /accounts :id get account by find By Email and Username`, () =>
    request(app.getHttpServer())
      .get(`/accounts/find`)
      .query({
        email: newAccount.email,
        username: newAccount.username,
      })
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(({ body }) => {
        expect(body.id).toBe(newAccountId);
        expect(body.username).toBe(newAccount.username.toLowerCase());
        expect(body.email).toBe(newAccount.email.toLowerCase());
      }));

  it(`PATCH /accounts/:id update account`, () => {
    newAccount.email = `tes-${randomstring.generate(5).toLowerCase()}@test.com`;

    return request(app.getHttpServer())
      .patch(`/accounts/${newAccountId}`)
      .send(newAccount)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(200);
  });

  it(`GET /accounts :id get updated account`, () => {
    return request(app.getHttpServer())
      .get(`/accounts/${newAccountId}`)
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => expect(body.email).toBe(newAccount.email));
  });

  it(`PATCH /accounts/changeCredential/:id change account credential`, () => {
    const newCredential: AccountCredential = {
      type: 'password',
      value: '1234567-new',
    };

    return request(app.getHttpServer())
      .patch(`/accounts/changeCredential/${newAccountId}`)
      .send(newCredential)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(200);
  });

  it(`PUT /accounts/roles/:id add account roles`, () => {
    return request(app.getHttpServer())
      .put(`/accounts/roles/${newAccountId}`)
      .set('Accept', 'application/json')
      .send({ roles: ['admin'] })
      .expect(200);
  });

  it(`GET /accounts roles/:id get account roles`, () => {
    return request(app.getHttpServer())
      .get(`/accounts/roles/${newAccountId}`)
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        expect(_.find(body, { name: 'admin' })).toBeDefined();
      });
  });

  it(`DELETE /accounts/roles/:id delete account roles`, () => {
    return request(app.getHttpServer())
      .delete(`/accounts/roles/${newAccountId}`)
      .set('Accept', 'application/json')
      .send({ roles: ['admin'] })
      .expect(200);
  });

  it(`GET /accounts roles/:id get account roles`, () => {
    return request(app.getHttpServer())
      .get(`/accounts/roles/${newAccountId}`)
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        expect(_.find(body, { name: 'admin' })).toBeUndefined();
      });
  });

  it(`PATCH /accounts/disable/username/:username disable created account by username`, () => {
    return request(app.getHttpServer())
      .patch(`/accounts/disable/username/${newAccount.username}`)
      .set('Accept', 'application/json')
      .expect(200);
  });

  it(`GET /accounts :id get disables account should return 200`, () => {
    return request(app.getHttpServer())
      .get(`/accounts/${newAccountId}`)
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(body.enabled).toBe(false);
      });
  });

  it(`DELETE /accounts/username/:username delete created account by username`, () => {
    return request(app.getHttpServer())
      .delete(`/accounts/username/${newAccount.username}`)
      .set('Accept', 'application/json')
      .expect(200);
  });

  it(`GET /accounts :id get deleted account should return 404`, () => {
    return request(app.getHttpServer())
      .get(`/accounts/${newAccountId}`)
      .set('Accept', 'application/json')
      .expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
