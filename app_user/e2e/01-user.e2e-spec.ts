import { ErrorFilter } from '@magishift/util/dist';
import { HttpModule, INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import uuid = require('uuid');
import { entities } from '../src/entities';
import { AccountService } from '../src/user/account.service';
import { UserController } from '../src/user/user.controller';
import { User } from '../src/user/user.entity';
import { UserModule } from '../src/user/user.module';
import { UserService } from '../src/user/user.service';
import { updatedName, updateSeed, userSeed } from './mock';

describe('Testing User', () => {
  let app: INestApplication;

  const accountService = {
    create: () => {
      return {
        data: { id: uuid() },
      };
    },

    delete: () => {
      return {
        status: 200,
      };
    },
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities,
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User]),
        UserModule,
        HttpModule,
      ],
      providers: [UserService, AccountService],
      controllers: [UserController],
      exports: [UserService],
    })
      .overrideProvider(AccountService)
      .useValue(accountService)
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new ErrorFilter(Logger));

    await app.init();
  });

  it(`GET /user to fetch user list`, () => {
    return request(app.getHttpServer())
      .get('/user')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
      });
  });

  it(`POST /user to create user`, () => {
    return request(app.getHttpServer())
      .post('/user')
      .send(userSeed)
      .set('Accept', 'application/json')
      .expect(201)
      .then(({ body }) => {
        expect(body.id).toBe(userSeed.id);
      });
  });

  it(`GET /user/${userSeed.id} to fetch created user`, () => {
    return request(app.getHttpServer())
      .get(`/user/${userSeed.id}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBe(userSeed.id);
      });
  });

  it(`PATCH /user/${userSeed.id} update created user`, () => {
    const updateData = updateSeed as any;
    updateData.nickName = updatedName;

    return request(app.getHttpServer())
      .patch(`/user/${userSeed.id}`)
      .send(updateData)
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(body.nickName).toBe(updatedName);
      });
  });

  it(`GET /user/${userSeed.id} to fetch updated user`, () => {
    return request(app.getHttpServer())
      .get(`/user/${userSeed.id}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.nickName).toBe(updatedName);
      });
  });

  it(`PATCH /user/delete/${userSeed.id} soft delete created user`, () => {
    return request(app.getHttpServer())
      .patch(`/user/delete/${userSeed.id}`)
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(body.isDeleted).toBe(true);
      });
  });

  it(`DELETE /user/${userSeed.id} delete created user`, () => {
    return request(app.getHttpServer())
      .delete(`/user/${userSeed.id}`)
      .set('Accept', 'application/json')
      .expect(200);
  });

  it(`GET /user/${userSeed.id} to fetch deleted user`, () => {
    return request(app.getHttpServer())
      .get(`/user/${userSeed.id}`)
      .expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
