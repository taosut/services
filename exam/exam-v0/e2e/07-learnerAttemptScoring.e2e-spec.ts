import { ErrorFilter } from '@magishift/util';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import dotenv = require('dotenv');
import request from 'supertest';
import uuid = require('uuid');
import { Attempt } from '../src/exam/attempt/attempt.entity';
import { Exam } from '../src/exam/exam.entity';
import { QuestionType } from '../src/exam/question/questionType.enum';
import { learningType } from '../src/learning/learningType.enum';
import { ormconfig } from './ormconfig';

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env.test',
});
process.env = { ...parsed, ...process.env };

describe('LearnerAttemptController (e2e) - Scoring', () => {
  let app: INestApplication;

  const token: string =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJjM2I4YmM2OS01MGZjLTQzN2YtYThmYy0zOTVkMmM0NjQ4NGMifQ.eyJqdGkiOiI2OGYwN2IxZi04NmM4LTRmOTItYjMzOS01ZDA2M2VmYjY4MjciLCJleHAiOjE1NjcwODQwMzYsIm5iZiI6MCwiaWF0IjoxNTY3MDQ4MDM2LCJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjg4ODgvYXV0aC9yZWFsbXMvYWdvcmEtZW50ZXJwcmlzZSIsInN1YiI6IjMwNGJiNWQ2LWE3NTItNGZjYy1hZTI4LTQ4ZmJmYjVkM2Y1NSIsInR5cCI6IlNlcmlhbGl6ZWQtSUQiLCJhdXRoX3RpbWUiOjAsInNlc3Npb25fc3RhdGUiOiI3YTVmMzJlNC05NTczLTQ5NmQtYjc3Zi03ZDE1YzI2MmFiMzgiLCJzdGF0ZV9jaGVja2VyIjoidWh5cjc3TFkxRVI1a29Ec2FMSXpBZS1LNWNSajQ2OF9BWFVlZ1RiYXByRSJ9.7oLpHy8_7YBhNMZZ87eZ5xHn4RL9zbQnFGk1GVFMzVo';
  const examData: Partial<Exam> = {
    title: 'Final Test Scoring',
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
    type: QuestionType.SCORING,
    answers: [
      {
        answer: 'Choice A',
        score: 10,
      },
      {
        answer: 'Choice B',
        score: 5,
      },
      {
        answer: 'Choice C',
        score: 0,
      },
    ],
    exam_id: null,
  };

  let examId: string;
  let questionId: string;
  let answerObject: any = {
    question_id: null,
    choosen_answer_ids: [uuid.v4()],
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
    user_id: 'userIdLearner',
  };

  //   let attemptTimeIsUp = false;

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
        answerObject = {
          ...answerObject,
          question_id: questionId,
          choosen_answer_ids: [body.answers[0].id],
        };
      });
  });
  // end - exam and question

  it('/POST /learner/exam/{examId}/attempt', () => {
    return request(app.getHttpServer())
      .post('/learner/exam/' + examId + '/attempt')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .then(({ status, body, error }) => {
        if (status === 200 || status === 201) {
          console.info(body);
          expect(body.id).toBeDefined();
        } else {
          if (error.text === '"TIME\'S UP"') {
            return request(app.getHttpServer())
              .post('/learner/exam/' + examId + '/attempt')
              .set('Accept', 'application/json')
              .then(res => {
                expect(res.body.id).toBeDefined();
              });
          }
        }
      });
  });

  it('/POST /learner/exam/{examId}/attempt/answer', () => {
    return request(app.getHttpServer())
      .post('/learner/exam/' + examId + '/attempt/answer')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send(answerObject)
      .expect(201)
      .then(() => {
        // expect(body.id).toBeDefined();
      });
  });

  it('/POST /learner/exam/{examId}/attempt/finish', () => {
    return request(app.getHttpServer())
      .post('/learner/exam/' + examId + '/attempt/finish')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .expect(200)
      .then(() => {
        // expect(body.id).toBeDefined();
      });
  });

  afterAll(() => {
    app.close();
  });
});
