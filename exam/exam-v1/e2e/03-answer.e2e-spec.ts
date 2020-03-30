import { ErrorFilter } from '@magishift/util';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { Exam } from '../src/exam/exam.entity';
import { Answer } from '../src/exam/question/answer/answer.entity';
import { ormconfig } from './ormconfig';

describe('AnswerController (e2e)', () => {
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

  let answerData: Partial<Answer> = {
    answer: 'Choice A',
    correct: false,
    question_id: null,
  };

  let examId: string;
  let questionId: string;
  let answerId: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule(ormconfig).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new ErrorFilter(Logger));
    await app.init();
  });

  // exam and question
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
        answerData = {
          ...answerData,
          question_id: questionId,
        };
      });
  });
  // end - exam and question

  it('/POST /question/{questionId}/answer', () => {
    return request(app.getHttpServer())
      .post('/question/' + questionId + '/answer')
      .set('Accept', 'application/json')
      .send(answerData)
      .expect(201)
      .then(({ body }) => {
        expect(body.id).toBeDefined();

        answerId = body.id;
      });
  });

  it('/GET /question/{questionId}/answer', () => {
    return request(app.getHttpServer())
      .get('/question/' + questionId + '/answer')
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
      });
  });

  it('/GET /question/{questionId}/answer/{id}', () => {
    return request(app.getHttpServer())
      .get('/question/' + questionId + '/answer/' + answerId)
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/PUT /question/{questionId}/answer/{id}', () => {
    return request(app.getHttpServer())
      .put('/question/' + questionId + '/answer/' + answerId)
      .set('Accept', 'application/json')
      .send(answerData)
      .expect(200);
  });

  it('/DELETE /question/{questionId}/answer/{id}', () => {
    return request(app.getHttpServer())
      .delete('/question/' + questionId + '/answer/' + answerId)
      .set('Accept', 'application/json')
      .expect(200);
  });

  afterAll(() => {
    app.close();
  });
});
