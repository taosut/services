import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { ErrorFilter } from '@magishift/util';
import { Exam } from '../src/exam/exam.entity';
import { ormconfig } from './ormconfig';

describe('ExamController (e2e)', () => {
  let app: INestApplication;

  const examData: Partial<Exam> = {
    title: 'Final Test 1',
    description: null,
    case_study: 'Case Study here',
    duration: 0,
    published: false,
    started_at: new Date(),
    ended_at: new Date(),
    meta: {
      class_id: '',
      track_id: '',
      unit_id: '',
    },
  };

  let examId: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule(ormconfig).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new ErrorFilter(Logger));
    await app.init();
  });

  it('/GET /exam', () => {
    return request(app.getHttpServer())
      .get('/exam')
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
      });
  });

  it('/POST /exam', () => {
    return request(app.getHttpServer())
      .post('/exam')
      .set('Accept', 'application/json')
      .send(examData)
      .expect(201)
      .then(({ body }) => {
        expect(body.id).toBeDefined();

        examId = body.id;
      });
  });

  it('/GET /exam/{Id}', () => {
    return request(app.getHttpServer())
      .get('/exam/' + examId)
      .set('Accept', 'application/json')
      .expect(200);
  });

  // it('/GET /exam/{Id}/questions', () => {
  //   return request(app.getHttpServer())
  //     .get('/exam/' + examId)
  //     .set('Accept', 'application/json')
  //     .expect(200);
  // });

  it('/PUT /exam/{Id}', () => {
    return request(app.getHttpServer())
      .put('/exam/' + examId)
      .set('Accept', 'application/json')
      .send(examData)
      .expect(200);
  });

  it('/DELETE /exam/{id}/soft', () => {
    return request(app.getHttpServer())
      .delete('/exam/' + examId + '/soft')
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/PUT /exam/{id}/restore', () => {
    return request(app.getHttpServer())
      .put('/exam/' + examId + '/restore')
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/DELETE /exam/{id}/soft', () => {
    return request(app.getHttpServer())
      .delete('/exam/' + examId + '/soft')
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/DELETE /exam/{id}', () => {
    return request(app.getHttpServer())
      .delete('/exam/' + examId + '')
      .set('Accept', 'application/json')
      .expect(200);
  });

  afterAll(() => {
    app.close();
  });
});
