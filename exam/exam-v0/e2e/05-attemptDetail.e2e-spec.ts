import { ErrorFilter } from '@magishift/util';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import dotenv = require('dotenv');
import request from 'supertest';
import { Attempt } from '../src/exam/attempt/attempt.entity';
import { AttemptDetail } from '../src/exam/attempt/attemptDetail/attemptDetail.entity';
import { Exam } from '../src/exam/exam.entity';
import { Answer } from '../src/exam/question/answer/answer.entity';
import { learningType } from '../src/learning/learningType.enum';
import { ormconfig } from './ormconfig';

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env.test',
});
process.env = { ...parsed, ...process.env };

describe('AttemptDetailController (e2e)', () => {
  let app: INestApplication;

  const examData: Partial<Exam> = {
    title: 'Final Test 1',
    description: null,
    duration: 0,
    published: false,
    started_at: new Date(),
    ended_at: new Date(),
    part_of: learningType.TRACK,
    part_of_id: null,
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

  let attemptData: Partial<Attempt> = {
    total_attempted: 1,
    total_question: 2,
    total_correct: 2,
    latest_score: '100',
    elapsed_time: 3610,
    finished: false,
    latest_started_at: new Date(),
    exam_id: null,
    user_id: 'user_id',
  };

  let attemptDetailData: Partial<AttemptDetail> = {
    question: null,
    question_id: null,
    sort_order: 1,
    attempt_id: null,
  };

  let examId: string;
  let questionId: string;
  let attemptId: string;
  let attemptDetailId: string;

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
        attemptData = {
          ...attemptData,
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
        attemptDetailData = {
          ...attemptDetailData,
          question: body.question,
          question_id: questionId,
        };
      });
  });
  // end - exam and question

  // attempt
  it('/POST /attempt', () => {
    return request(app.getHttpServer())
      .post('/attempt')
      .set('Accept', 'application/json')
      .send(attemptData)
      .expect(201)
      .then(({ body }) => {
        expect(body.id).toBeDefined();

        attemptId = body.id;

        attemptDetailData = {
          ...attemptDetailData,
          attempt_id: attemptId,
        };
      });
  });
  // end attempt

  it('/POST /attempt/{attemptId}/detail', () => {
    return request(app.getHttpServer())
      .post('/attempt/' + attemptId + '/detail')
      .set('Accept', 'application/json')
      .send(attemptDetailData)
      .expect(201)
      .then(({ body }) => {
        expect(body.id).toBeDefined();

        attemptDetailId = body.id;
      });
  });

  it('/GET /attempt/{attemptId}/detail', () => {
    return request(app.getHttpServer())
      .get('/attempt/' + attemptId + '/detail')
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
      });
  });

  it('/GET /attempt/{id}/detail', () => {
    return request(app.getHttpServer())
      .get('/attempt/' + attemptId + '/detail/' + attemptDetailId)
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/PUT /attempt/{attemptId}/detail/{id}', () => {
    return request(app.getHttpServer())
      .put('/attempt/' + attemptId + '/detail/' + attemptDetailId)
      .set('Accept', 'application/json')
      .send(attemptDetailData)
      .expect(200);
  });

  it('/DELETE /attempt/{attemptId}/detail/{id}', () => {
    return request(app.getHttpServer())
      .delete('/attempt/' + attemptId + '/detail/' + attemptDetailId)
      .set('Accept', 'application/json')
      .expect(200);
  });

  afterAll(() => {
    app.close();
  });
});
