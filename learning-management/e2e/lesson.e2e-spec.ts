import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ApplicationModule } from '../src/app.module';
import { LessonModule } from '../src/providers/lesson/lesson.module';
import { LessonService } from '../src/providers/lesson/lesson.service';
import { data as lessonData } from '../src/database/seeders/lesson/data';
import { mockLessonService } from './mock/lesson.mock';

describe('LessonController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [ApplicationModule, LessonModule],
    })
    .overrideProvider(LessonService)
    .useValue(mockLessonService)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/POST /lesson', () => {
    return request(app.getHttpServer())
      .post('/lesson')
      .set('Accept', 'application/json')
      .send(lessonData[0])
      .expect(201);
  });

  it('/GET /lesson', () => {
    return request(app.getHttpServer())
      .get('/lesson')
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/GET /lesson --no-paginate --keyword', () => {
    return request(app.getHttpServer())
      .get('/lesson?per_page=no-paginate&keyword=' + lessonData[0].title)
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/GET /lesson --no-paginate --keyword-not-found', () => {
    return request(app.getHttpServer())
      .get('/lesson?per_page=no-paginate&keyword=' + lessonData[0].title + '-not-found')
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/GET /lesson/{id}', () => {
    return request(app.getHttpServer())
      .get('/lesson/' + lessonData[0].id)
      .set('Accept', 'application/json')
      .expect(200);
  });

  // it('/GET /lesson/{slug} --not-found', () => {
  //   return request(app.getHttpServer())
  //     .get('/lesson/test-not-found')
  //     .expect(404);
  // });

  it('/PUT /lesson/{id}', () => {
    return request(app.getHttpServer())
      .put('/lesson/' + lessonData[0].id)
      .set('Accept', 'application/json')
      .send(lessonData[0])
      .expect(200);
  });

  it('/PUT /lesson/{id}', () => {
    return request(app.getHttpServer())
      .put('/lesson/' + lessonData[0].id)
      .set('Accept', 'application/json')
      .send(lessonData[0])
      .expect(200);
  });

  it('/DELETE /lesson/{id}', () => {
    return request(app.getHttpServer())
      .delete('/lesson/' + lessonData[0].id)
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/PUT /lesson/{id}/restore', () => {
    return request(app.getHttpServer())
      .put('/lesson/' + lessonData[0].id + '/restore')
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/DELETE /lesson/{id}/force', () => {
    return request(app.getHttpServer())
      .delete('/lesson/' + lessonData[0].id + '/force')
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/PATCH /lesson/{id}/order', () => {
    return request(app.getHttpServer())
      .patch('/lesson/' + lessonData[0].id + '/order')
      .set('Accept', 'application/json')
      .send({sort_order: 1})
      .expect(200);
  });

  afterAll(() => {
    app.close();
  });
});
