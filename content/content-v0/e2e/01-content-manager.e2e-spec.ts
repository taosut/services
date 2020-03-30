import { ErrorFilter } from '@magishift/util';
import {
  HttpModule,
  INestApplication,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { ContentController } from '../src/modules/content/content.controller';
import { Content } from '../src/modules/content/content.entity';
import { ContentModule } from '../src/modules/content/content.module';
import { ContentService } from '../src/modules/content/content.service';
import { ContentDto } from '../src/modules/content/types/content.dto';
import { EContentType } from '../src/modules/content/types/content.enum';

describe('Content', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Content],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Content]),
        ContentModule,
        HttpModule,
      ],
      providers: [ContentService],
      controllers: [ContentController],
      exports: [ContentService],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new ErrorFilter(Logger));

    await app.init();
  });

  const contentData: ContentDto = {
    name: 'string',
    ownership: 'string',
    uploadedBy: 'string',
    realm: 'string',
    path: 'string',
    size: 0,
    fileType: EContentType.mp4,
  };

  it(`GET /content to fetch content list`, () => {
    return request(app.getHttpServer())
      .get('/content')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body));
        expect(body.length).toBeGreaterThanOrEqual(0);
      });
  });

  it(`POST /content to create content`, () => {
    return request(app.getHttpServer())
      .post('/content')
      .send(contentData)
      .set('Accept', 'application/json')
      .expect(201)
      .then(({ body }) => {
        expect(body.id).toBeDefined();

        contentData.id = body.id;
      });
  });

  it(`GET /content/${contentData.id} to fetch content by id`, () => {
    return request(app.getHttpServer())
      .get(`/content/${contentData.id}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
      });
  });

  it('/PATCH /category/{id}', () => {
    return request(app.getHttpServer())
      .patch('/content/' + contentData.id)
      .set('Accept', 'application/json')
      .send(contentData)
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
      });
  });

  it('/GET /content/{id}/signed-url', () => {
    return request(app.getHttpServer())
      .get('/content/' + contentData.id + '/signed-url')
      .set('Accept', 'application/json')
      .expect(200);
  });

  it(`DELETE /content/${contentData.id} to delete content by id`, () => {
    return request(app.getHttpServer())
      .delete(`/content/${contentData.id}`)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
