import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ApplicationModule } from '../src/app.module';
import { QuizQuestionModule } from '../src/providers/quizquestion/quizquestion.module';
import { QuizQuestionService } from '../src/providers/quizquestion/quizquestion.service';
import { data as quizquestionData } from '../src/database/seeders/quizquestion/data';
import { data as quizanswerData } from '../src/database/seeders/quizanswer/data';
import { mockQuizQuestionService } from './mock/quizquestion.mock';
import { LessonService } from '../src/providers/lesson/lesson.service';
import { mockLessonService } from './mock/lesson.mock';
import { QuizAnswerService } from '../src/providers/quizanswer/quizanswer.service';
import { mockQuizAnswerService } from './mock/quizanswer.mock';

describe('QuizQuestionController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [ApplicationModule, QuizQuestionModule],
    })
    .overrideProvider(QuizQuestionService)
    .useValue(mockQuizQuestionService)
    .overrideProvider(LessonService)
    .useValue(mockLessonService)
    .overrideProvider(QuizAnswerService)
    .useValue(mockQuizAnswerService)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/POST /quiz_question', () => {
    return request(app.getHttpServer())
      .post('/quiz_question')
      .set('Accept', 'application/json')
      .send({
        ...quizquestionData[0],
        answers: quizanswerData,
      })
      .expect(201);
  });

  it('/PUT /quiz_question/{id}', () => {
    return request(app.getHttpServer())
      .put('/quiz_question/' + quizquestionData[0].id)
      .set('Accept', 'application/json')
      .send(quizquestionData[0])
      .expect(200);
  });

  it('/DELETE /quiz_question/{id}', () => {
    return request(app.getHttpServer())
      .delete('/quiz_question/' + quizquestionData[0].id)
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/PUT /quiz_question/{id}/restore', () => {
    return request(app.getHttpServer())
      .put('/quiz_question/' + quizquestionData[0].id + '/restore')
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/DELETE /quiz_question/{id}/force', () => {
    return request(app.getHttpServer())
      .delete('/quiz_question/' + quizquestionData[0].id + '/force')
      .set('Accept', 'application/json')
      .expect(200);
  });

  afterAll(() => {
    app.close();
  });
});
