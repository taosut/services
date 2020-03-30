import { config } from 'dotenv';
const { parsed } = config();
process.env = { ...parsed, ...process.env };

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { Channel } from '../src/modules/channel/channel.entity';
import { ChannelModule } from '../src/modules/channel/channel.module';

describe('Test Channel', () => {
  let app: INestApplication;

  const fixture: Partial<Channel> = {
    name: 'Test',
    author_id: 'AUTHOR_ID',
  };

  let newChannelId: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Channel],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Channel]),
        ChannelModule,
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  it(`GET / to fetch all channels`, () =>
    request(app.getHttpServer())
      .get('/channel/?order=["id ASC"]')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThanOrEqual(0);
      }));

  it(`POST / add new channel`, () =>
    request(app.getHttpServer())
      .post('/channel')
      .send(fixture)
      .set('Accept', 'application/json')
      .expect(201)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
        expect(body.slug).toBeDefined();

        fixture.slug = body.slug;
        newChannelId = body.id;
      }));

  it(`GET /channel/:id to fetch created channel`, () =>
    request(app.getHttpServer())
      .get(`/channel/${newChannelId}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.name).toBe(fixture.name);
      }));

  it(`PATCH /update created channel`, () => {
    const updateData = Object.assign(fixture);
    updateData.name = 'Updated';

    request(app.getHttpServer())
      .patch(`/channel/${newChannelId}`)
      .send(updateData)
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(body.name).toBe(updateData.name);
      });
  });

  it(`GET /channel/:id to fetch updated channel`, () =>
    request(app.getHttpServer())
      .get(`/channel/${newChannelId}`)
      .expect(200));

  it(`DELETE /channel/:slug delete created channel`, () =>
    request(app.getHttpServer())
      .delete(`/channel/${newChannelId}`)
      .set('Accept', 'application/json')
      .expect(200));

  afterAll(async () => {
    await app.close();
  });
});
