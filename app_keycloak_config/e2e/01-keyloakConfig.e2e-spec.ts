import { config } from 'dotenv';
const { parsed } = config();
process.env = { ...parsed, ...process.env };

import { ErrorFilter } from '@magishift/util';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { IKeycloakConfig } from '../src/configs/interfaces/keycloakConfig.interface';
import { KeycloakConfig } from '../src/configs/keycloakConfig.entity';
import { KeycloakConfigModule } from '../src/configs/keycloakConfig.module';
import { KeycloakGuard } from '../src/guards/keycloak.guard';

describe('Test Keycloak Config', () => {
  let app: INestApplication;

  const mainRealmName = process.env.KEYCLOAK_REALM_MAIN;

  const fixture: IKeycloakConfig = {
    realm: 'Test',
    client: 'test-client',
    public: true,
  };

  let newConfigId: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [KeycloakConfig],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([KeycloakConfig]),
        KeycloakConfigModule,
      ],
    })
      .overrideGuard(KeycloakGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new ErrorFilter(Logger));

    await app.init();
  });

  it(`GET / to fetch all configs`, () =>
    request(app.getHttpServer())
      .get('/?order=["id ASC"]')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThanOrEqual(0);
      }));

  it(`GET /realm/:mainRealm to fetch keycloak main config`, () =>
    request(app.getHttpServer())
      .get(`/realm/${mainRealmName}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.realm).toBe(mainRealmName);
      }));

  it(`POST / add new realm config`, () =>
    request(app.getHttpServer())
      .post('/')
      .send(fixture)
      .set('Accept', 'application/json')
      .expect(201)
      .then(({ body }) => {
        expect(body.realm).toBe(fixture.realm);
        expect(body.id).toBeDefined();

        newConfigId = body.id;
      }));

  it(`POST / add duplicate realm config`, () =>
    request(app.getHttpServer())
      .post('/')
      .send(fixture)
      .set('Accept', 'application/json')
      .expect(409));

  it(`GET /realm/:realm to fetch created realm config`, () =>
    request(app.getHttpServer())
      .get(`/realm/${fixture.realm}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.realm).toBe(fixture.realm);
      }));

  it(`PATCH / update created config`, () => {
    const updateData = Object.assign(fixture);

    updateData.id = newConfigId;
    updateData.client = 'client-change';

    request(app.getHttpServer())
      .patch(`/${newConfigId}`)
      .send(updateData)
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(body.client).toBe(updateData.client);
      });
  });

  it(`GET /realm/:realm to fetch updated config`, () =>
    request(app.getHttpServer())
      .get(`/realm/${fixture.realm}`)
      .expect(200));

  it(`DELETE /realm/:realm delete created config`, () =>
    request(app.getHttpServer())
      .delete(`/realm/${fixture.realm}`)
      .set('Accept', 'application/json')
      .expect(200));

  it(`GET /realm/:realm to fetch deleted config`, () =>
    request(app.getHttpServer())
      .get(`/realm/${fixture.realm}`)
      .expect(404));

  afterAll(async () => {
    await app.close();
  });
});
