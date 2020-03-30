import { ErrorFilter } from '@magishift/util';
import {
  HttpModule,
  INestApplication,
  Logger,
  ValidationPipe
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import Axios from 'axios';
import * as request from 'supertest';
import uuid = require('uuid');
import { ContentController } from '../src/content/content.controller';
import { Content } from '../src/content/content.entity';
import { ContentModule } from '../src/content/content.module';
import { ContentService } from '../src/content/content.service';

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

  const contentData = {
    id: uuid(),
    name: 'string',
    ownership: 'string',
    uploadedBy: 'string',
    realm: 'string',
    path: 'string',
    size: 0,
    fileType: 'string',
  };

  const reqUrlPreSigned = {
    contentType: 'audio/mp3',
    id: contentData.id,
    filename: 'test',
  };

  // let signedUrl: string;
  // let contentType: string;

  const filePath = `${__dirname}/mockfiles/testaudio.mp3`;

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
        expect(body.id).toEqual(contentData.id);
      });
  });

  it(`POST /content/signed-url to generate pre signed url and upload file`, () => {
    return request(app.getHttpServer())
      .post(
        `/content/signed-url?content-type=${reqUrlPreSigned.contentType}&id=${reqUrlPreSigned.id}&filename=${reqUrlPreSigned.filename}`
      )
      .set('Accept', 'application/json')
      .expect(201)
      .then(async ({ body }) => {
        Axios.put(body.url, filePath, {
          headers: {
            'Content-Type': body.ContentType,
          },
        }).then(({ status }) => {
          console.info(status);
          expect(status).toEqual(200);
        });
      });
  });

  // console.info(signedUrl);
  // it(`PUT /upload to upload file`, () => {
  //   return request(app.getHttpServer())
  //     .put(signedUrl)
  //     .set('Content-Type', contentType)
  //     .attach('file', filePath)
  //     .expect(200);
  // });

  // it(`POST /content/signed-url to generate pre signed url`, () => {
  //   return request(app.getHttpServer())
  //     .post(
  //       `/content/signed-url?content-type=${reqUrlPreSigned.contentType}&id=${
  //         reqUrlPreSigned.id
  //       }&filename=${reqUrlPreSigned.filename}`
  //     )
  //     .set('Accept', 'application/json')
  //     .expect(201)
  //     .then(({ body }) => {
  //       console.info(body);
  //       // expect(body.id).toEqual(contentData.id);
  //     });
  // });

  it(`GET /content/${contentData.id} to fetch content by id`, () => {
    return request(app.getHttpServer())
      .get(`/content/${contentData.id}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toEqual(contentData.id);
      });
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
