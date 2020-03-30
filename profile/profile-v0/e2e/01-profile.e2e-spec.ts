import { INestApplication, Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { ErrorFilter } from '@magishift/util';
import uuid = require('uuid');
import { Profile } from '../src/profile/profile.entity';
import { AccountService } from '../src/services/account.service';
import { ormconfig } from './ormconfig';

describe('ProfileController (e2e)', () => {
  let app: INestApplication;

  const realm = 'agora';
  const profileData: Partial<Profile> = {
    account_id: uuid.v4(),
  };
  const profileDatas: Array<Partial<Profile>> = [
    {
      account_id: uuid.v4(),
    },
  ];
  const accountData: Partial<Profile> = {
    id: profileDatas[0].account_id,
  };

  let profileId: string;

  const mockAccountService = {
    auth: () => Promise.resolve(true),
    find: () => Promise.resolve([accountData]),
    findOne: () => Promise.resolve(accountData),
    findOneByEmail: () => Promise.resolve(accountData),
    findOneByUsername: () => Promise.resolve(accountData),
    create: () => Promise.resolve(accountData),
    update: () => Promise.resolve(accountData),
    delete: () => Promise.resolve(accountData),
    deleteByUsername: () => Promise.resolve(accountData),
    purge: () => Promise.resolve(accountData),
    purgeByUsername: () => Promise.resolve(accountData),
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule(ormconfig)
      .overrideProvider(AccountService)
      .useValue(mockAccountService)
      .compile();

    app = module.createNestApplication();
    app.useGlobalFilters(new ErrorFilter(Logger));
    await app.init();
  });

  it('/GET /profiles', () => {
    return request(app.getHttpServer())
      .get('/profiles')
      .set('Accept', 'application/json')
      .set('Realm', realm)
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
      });
  });

  it('/POST /profiles', () => {
    return request(app.getHttpServer())
      .post('/profiles')
      .set('Accept', 'application/json')
      .set('Realm', realm)
      .send(profileData)
      .expect(201)
      .then(({ body }) => {
        expect(body.id).toBeDefined();

        profileId = body.id;
      });
  });

  it('/GET /profiles/{id}', () => {
    return request(app.getHttpServer())
      .get('/profiles/' + profileId)
      .set('Accept', 'application/json')
      .set('Realm', realm)
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
      });
  });

  it('/PUT /profiles/{id}', () => {
    return request(app.getHttpServer())
      .put('/profiles/' + profileId)
      .set('Accept', 'application/json')
      .set('Realm', realm)
      .send(profileData)
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
      });
  });

  it('/PATCH /profiles/{id}', () => {
    return request(app.getHttpServer())
      .patch('/profiles/' + profileId)
      .set('Accept', 'application/json')
      .set('Realm', realm)
      .send(profileData)
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
      });
  });

  it('/POST /profiles/bulk', () => {
    return request(app.getHttpServer())
      .post('/profiles/bulk')
      .set('Accept', 'application/json')
      .set('Realm', realm)
      .send({ bulk: profileDatas })
      .expect(201)
      .then(({ body }) => {
        if (body.length > 0) {
          profileId = body[0].id;
        }
      });
  });

  it('/GET /profiles/account/fetchByAccountId', () => {
    return request(app.getHttpServer())
      .get('/profiles/account/fetchByAccountId?account_id=' + accountData.id)
      .set('Accept', 'application/json')
      .set('Realm', realm)
      .expect(200);
  });

  it('/GET /profiles/account/fetchByUsername', () => {
    return request(app.getHttpServer())
      .get('/profiles/account/fetchByUsername?username=username')
      .set('Accept', 'application/json')
      .set('Realm', realm)
      .expect(200);
  });

  it('/GET /profiles/account/fetchByEmail', () => {
    return request(app.getHttpServer())
      .get('/profiles/account/fetchByEmail?email=email')
      .set('Accept', 'application/json')
      .set('Realm', realm)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
