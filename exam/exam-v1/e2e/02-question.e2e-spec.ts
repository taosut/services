import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { ErrorFilter } from '@magishift/util';
import { Exam } from '../src/exam/exam.entity';
import { QuestionType } from '../src/exam/question/questionType.enum';
import { ormconfig } from './ormconfig';

describe('QuestionController (e2e)', () => {
  let app: INestApplication;

  const examData: Partial<Exam> = {
    title: 'Final Test 1',
    description: null,
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

  let questionData: any = {
    question: 'First Question',
    answers: [
      {
        answer: 'Choice A',
        correct: false,
      },
      {
        answer: 'Choice B',
        correct: true,
      },
      {
        answer: 'Choice C',
        correct: false,
      },
    ],
    exam_id: null,
  };

  let questionData2: any = {
    question: 'Other First Question',
    type: QuestionType.MULTIPLE_CHOICE,
    answers: [
      {
        answer: 'Choice A',
        correct: false,
        score: null,
      },
      {
        answer: 'Choice B',
        correct: true,
        score: null,
      },
      {
        answer: 'Choice C',
        correct: false,
        score: null,
      },
    ],
    exam_id: null,
  };

  let examId: string;
  let questionId: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule(ormconfig).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new ErrorFilter(Logger));
    await app.init();
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
        questionData = {
          ...questionData,
          exam_id: examId,
        };
        questionData2 = {
          ...questionData2,
          exam_id: examId,
        };
      });
  });

  it('/POST /question', () => {
    return request(app.getHttpServer())
      .post('/question')
      .set('Accept', 'application/json')
      .send(questionData)
      .expect(201)
      .then(({ body }) => {
        expect(body.id).toBeDefined();

        questionId = body.id;
      });
  });

  it('/GET /question', () => {
    return request(app.getHttpServer())
      .get('/question')
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
      });
  });

  it('/GET /question/{id}', () => {
    return request(app.getHttpServer())
      .get('/question/' + questionId)
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/PUT /question/{id}', () => {
    return request(app.getHttpServer())
      .put('/question/' + questionId)
      .set('Accept', 'application/json')
      .send(questionData)
      .expect(200);
  });

  it('/DELETE /question/{id}/soft', () => {
    return request(app.getHttpServer())
      .delete('/question/' + questionId + '/soft')
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/PUT /question/{id}/restore', () => {
    return request(app.getHttpServer())
      .put('/question/' + questionId + '/restore')
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/DELETE /question/{id}/soft', () => {
    return request(app.getHttpServer())
      .delete('/question/' + questionId + '/soft')
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/DELETE /question/{id}', () => {
    return request(app.getHttpServer())
      .delete('/question/' + questionId)
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/POST /question/bulk', () => {
    return request(app.getHttpServer())
      .post('/question/bulk')
      .set('Accept', 'application/json')
      .send({ bulk: [questionData] })
      .expect(201);
  });

  it('/POST /question/bulk/withAnswer', () => {
    return request(app.getHttpServer())
      .post('/question/bulk/withAnswer')
      .set('Accept', 'application/json')
      .send({ bulk: [questionData2] })
      .expect(201);
  });

  afterAll(() => {
    app.close();
  });
});
