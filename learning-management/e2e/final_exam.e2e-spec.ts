import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ApplicationModule } from '../src/app.module';
import { FinalExamModule } from '../src/providers/final_exam/final_exam.module';
import { FinalExamService } from '../src/providers/final_exam/final_exam.service';
import { data as finalExamData } from '../src/database/seeders/final_exam/data';
import { mockFinalExamService } from './mock/final_exam.mock';

describe('FinalExamController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [ApplicationModule, FinalExamModule],
    })
    .overrideProvider(FinalExamService)
    .useValue(mockFinalExamService)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/POST /final_exam', () => {
    return request(app.getHttpServer())
      .post('/final_exam')
      .set('Accept', 'application/json')
      .send(finalExamData[0])
      .expect(201);
  });

  it('/GET /final_exam', () => {
    return request(app.getHttpServer())
      .get('/final_exam')
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/GET /final_exam --no-paginate --keyword', () => {
    return request(app.getHttpServer())
      .get('/final_exam?per_page=no-paginate&keyword=' + finalExamData[0].title)
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/GET /final_exam --no-paginate --keyword-not-found', () => {
    return request(app.getHttpServer())
      .get('/final_exam?per_page=no-paginate&keyword=' + finalExamData[0].title + '-not-found')
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/GET /final_exam/{id}', () => {
    return request(app.getHttpServer())
      .get('/final_exam/' + finalExamData[0].id)
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/GET /final_exam/{id}/questions', () => {
    return request(app.getHttpServer())
      .get('/final_exam/' + finalExamData[0].id)
      .set('Accept', 'application/json')
      .expect(200);
  });

  // it('/GET /final_exam/{slug} --not-found', () => {
  //   return request(app.getHttpServer())
  //     .get('/final_exam/test-not-found')
  //     .expect(404);
  // });

  it('/PUT /final_exam/{id}', () => {
    return request(app.getHttpServer())
      .put('/final_exam/' + finalExamData[0].id)
      .set('Accept', 'application/json')
      .send(finalExamData[0])
      .expect(200);
  });

  it('/PUT /final_exam/{id}', () => {
    return request(app.getHttpServer())
      .put('/final_exam/' + finalExamData[0].id)
      .set('Accept', 'application/json')
      .send(finalExamData[0])
      .expect(200);
  });

  it('/DELETE /final_exam/{id}', () => {
    return request(app.getHttpServer())
      .delete('/final_exam/' + finalExamData[0].id)
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/PUT /final_exam/{id}/restore', () => {
    return request(app.getHttpServer())
      .put('/final_exam/' + finalExamData[0].id + '/restore')
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/DELETE /final_exam/{id}/force', () => {
    return request(app.getHttpServer())
      .delete('/final_exam/' + finalExamData[0].id + '/force')
      .set('Accept', 'application/json')
      .expect(200);
  });

  afterAll(() => {
    app.close();
  });
});
