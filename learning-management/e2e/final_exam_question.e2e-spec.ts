import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, forwardRef } from '@nestjs/common';
import { ApplicationModule } from '../src/app.module';
import { FinalExamQuestionModule } from '../src/providers/final_exam_question/final_exam_question.module';
import { FinalExamQuestionService } from '../src/providers/final_exam_question/final_exam_question.service';
import { data as finalExamQuestionData } from '../src/database/seeders/final_exam_question/data';
import { data as finalExamAnswerData } from '../src/database/seeders/final_exam_answer/data';
import { mockFinalExamQuestionService } from './mock/final_exam_question.mock';
import { FinalExamService } from '../src/providers/final_exam/final_exam.service';
import { mockFinalExamService } from './mock/final_exam.mock';
import { FinalExamModule } from '../src/providers/final_exam/final_exam.module';
import { FinalExamQuestionController } from '../src/controllers/final_exam_question/final_exam_question.controller';
import { FinalExamAnswerService } from '../src/providers/final_exam_answer/final_exam_answer.service';
import { mockFinalExamAnswerService } from './mock/final_exam_answer.mock';
import { FinalExamAnswerModule } from '../src/providers/final_exam_answer/final_exam_answer.module';

describe('FinalExamQuestionController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [ApplicationModule, FinalExamQuestionModule, FinalExamAnswerModule],
    })
    .overrideProvider(FinalExamQuestionService)
    .useValue(mockFinalExamQuestionService)
    .overrideProvider(FinalExamService)
    .useValue(mockFinalExamService)
    .overrideProvider(FinalExamAnswerService)
    .useValue(mockFinalExamAnswerService)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/POST /final_exam_question', () => {
    return request(app.getHttpServer())
      .post('/final_exam_question')
      .set('Accept', 'application/json')
      .send({
          ...finalExamQuestionData[0],
          answers: finalExamAnswerData,
      })
      .expect(201);
  });

  it('/PUT /final_exam_question/{id}', () => {
    return request(app.getHttpServer())
      .put('/final_exam_question/' + finalExamQuestionData[0].id)
      .set('Accept', 'application/json')
      .send({
        ...finalExamQuestionData[0],
        answers: [],
      })
      .expect(200);
  });

  it('/DELETE /final_exam_question/{id}', () => {
    return request(app.getHttpServer())
      .delete('/final_exam_question/' + finalExamQuestionData[0].id)
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/PUT /final_exam_question/{id}/restore', () => {
    return request(app.getHttpServer())
      .put('/final_exam_question/' + finalExamQuestionData[0].id + '/restore')
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/DELETE /final_exam_question/{id}/force', () => {
    return request(app.getHttpServer())
      .delete('/final_exam_question/' + finalExamQuestionData[0].id + '/force')
      .set('Accept', 'application/json')
      .expect(200);
  });

  afterAll(() => {
    app.close();
  });
});
