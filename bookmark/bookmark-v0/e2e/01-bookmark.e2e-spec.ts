import {
  HttpModule,
  INestApplication,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { ErrorFilter } from '@magishift/util';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarkController } from '../src/modules/bookmark/bookmark.controller';
import { Bookmark } from '../src/modules/bookmark/bookmark.entity';
import { BookmarkModule } from '../src/modules/bookmark/bookmark.module';
import { BookmarkService } from '../src/modules/bookmark/bookmark.service';
import { BookmarkDto } from '../src/modules/bookmark/types/bookmark.dto';
import {} from '../src/services/invokes/membership.service';

describe('Bookmark (e2e)', () => {
  let app: INestApplication;

  const bookmarkData: BookmarkDto = {
    user_id: 'string',
    class_id: 'string',
    track_id: 'string',
    unit_id: 'string',
    ebook_id: 'string',
  };

  let bookmarkId: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Bookmark],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Bookmark]),
        BookmarkModule,
        HttpModule,
      ],
      providers: [BookmarkService],
      controllers: [BookmarkController],
      exports: [BookmarkService],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new ErrorFilter(Logger));
    await app.init();
  });

  it('/GET /bookmark', () => {
    return request(app.getHttpServer())
      .get('/bookmark')
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
      });
  });

  it('/POST /bookmark', () => {
    return request(app.getHttpServer())
      .post('/bookmark')
      .set('Accept', 'application/json')
      .send(bookmarkData)
      .expect(201)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
        bookmarkId = body.id;
      });
  });

  it('/GET /bookmark/{id}', () => {
    return request(app.getHttpServer())
      .get(`/bookmark/${bookmarkId}`)
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
      });
  });

  it('/PUT /bookmark/{id}', () => {
    return request(app.getHttpServer())
      .put(`/bookmark/${bookmarkId}`)
      .set('Accept', 'application/json')
      .send(bookmarkData)
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
      });
  });

  it(`/PATCH /bookmark/${bookmarkId}`, () => {
    return request(app.getHttpServer())
      .patch(`/bookmark/${bookmarkId}`)
      .set('Accept', 'application/json')
      .send(bookmarkData)
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
      });
  });

  it(`/DELETE /bookmark/${bookmarkId}`, () => {
    return request(app.getHttpServer())
      .delete(`/bookmark/${bookmarkId}`)
      .set('Accept', 'application/json')
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
    await new Promise(resolve => setTimeout(() => resolve(), 500));
  });
});
