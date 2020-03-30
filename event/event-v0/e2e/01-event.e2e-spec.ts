import { HttpModule, INestApplication, Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { ErrorFilter } from '@magishift/util';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { EventController } from '../src/modules/event/event.controller';
import { Event } from '../src/modules/event/event.entity';
import { EventModule } from '../src/modules/event/event.module';
import { EventService } from '../src/modules/event/event.service';

describe('Event (e2e)', () => {
  let app: INestApplication;

  const eventData: Partial<Event> = {
    description: 'Description Test',
    title: 'Title Test',
    start_at: new Date(),
    end_at: new Date(),
    published: true,
    user_id: 'USER_ID',
  };

  let eventId: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Event],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Event]),
        EventModule,
        HttpModule,
      ],
      providers: [EventService],
      controllers: [EventController],
      exports: [EventService],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalFilters(new ErrorFilter(Logger));

    await app.init();
  });

  it('/GET /event', () => {
    return request(app.getHttpServer())
      .get('/event')
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
      });
  });

  it('/POST /event', () => {
    return request(app.getHttpServer())
      .post('/event')
      .set('Accept', 'application/json')
      .send(eventData)
      .expect(201)
      .then(({ body }) => {
        expect(body.id).toBeDefined();

        eventId = body.id;
      });
  });

  it('/GET /event/{id}', () => {
    return request(app.getHttpServer())
      .get('/event/' + eventId)
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
      });
  });

  it('/PUT /event/{id}', () => {
    return request(app.getHttpServer())
      .put('/event/' + eventId)
      .set('Accept', 'application/json')
      .send(eventData)
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
      });
  });

  it('/PATCH /event/{id}', () => {
    return request(app.getHttpServer())
      .patch('/event/' + eventId)
      .set('Accept', 'application/json')
      .send(eventData)
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
      });
  });

  it('/DELETE /event/{id}', () => {
    return request(app.getHttpServer())
      .delete('/event/' + eventId)
      .set('Accept', 'application/json')
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
