import dotenv = require('dotenv');
const { parsed } = dotenv.config();
process.env = { ...parsed, ...process.env };

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { KeycloakAuthModule } from '../src/auth/auth.module';

describe('Test Keycloak Auth Service', () => {
  let app: INestApplication;

  const realmMain: string = process.env.KEYCLOAK_REALM_MAIN;
  const username: string = process.env.KEYCLOAK_USER_MAIN;
  const password: string = process.env.KEYCLOAK_PASSWORD_MAIN;

  let accessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [KeycloakAuthModule],
    }).compile();

    app = module.createNestApplication();

    await app.init();
  });

  it(`POST /login login account`, done =>
    request(app.getHttpServer())
      .post(`/login`)
      .send({ username, password })
      .set('Accept', 'application/json')
      .set('Realm', realmMain)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(({ body }) => {
        accessToken = body.access_token;
        refreshToken = body.refresh_token;
        expect(body.access_token).toBeDefined();
        expect(body.refresh_token).toBeDefined();
        done();
      }));

  it(`POST /verifyToken/:realm verify invalid token`, () =>
    request(app.getHttpServer())
      .post(`/verifyToken/${realmMain}`)
      .set('Accept', 'application/json')
      .send({ token: 'Bearer random_format' })
      .expect(400));

  it(`POST /verifyToken/:realm verify token`, () =>
    request(app.getHttpServer())
      .post(`/verifyToken/${realmMain}`)
      .set('Accept', 'application/json')
      .send({ token: accessToken })
      .expect(200));

  it(`POST /verifyToken verify token with realm in header`, () =>
    request(app.getHttpServer())
      .post(`/verifyToken`)
      .set('Realm', realmMain)
      .set('Accept', 'application/json')
      .send({ token: accessToken })
      .expect(200));

  it(`GET /sessions get all user sessions`, () =>
    request(app.getHttpServer())
      .get(`/sessions`)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + accessToken)
      .set('Realm', realmMain)
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
      }));

  it(`POST /refreshToken refresh token`, done =>
    request(app.getHttpServer())
      .post(`/refreshToken`)
      .set('Accept', 'application/json')
      .set('Realm', realmMain)
      .send({ refreshToken })
      .expect(200)
      .then(({ body }) => {
        accessToken = body.access_token;
        refreshToken = body.refresh_token;
        expect(body.access_token).toBeDefined();
        expect(body.refresh_token).toBeDefined();
        done();
      }));

  it(`POST /logout logout account`, done =>
    request(app.getHttpServer())
      .post(`/logout`)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + accessToken)
      .set('Realm', realmMain)
      .send({ accessToken })
      .expect(200)
      .end(() => done()));

  afterAll(async () => {
    await app.close();
  });
});
