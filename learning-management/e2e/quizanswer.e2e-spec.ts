import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ApplicationModule } from '../src/app.module';
import { QuizAnswerModule } from '../src/providers/quizanswer/quizanswer.module';
import { QuizAnswerService } from '../src/providers/quizanswer/quizanswer.service';
import { data as quizanswerData } from '../src/database/seeders/quizanswer/data';
import { mockQuizAnswerService } from './mock/quizanswer.mock';
import { LessonService } from '../src/providers/lesson/lesson.service';
import { mockLessonService } from './mock/lesson.mock';

describe('QuizAnswerController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [ApplicationModule, QuizAnswerModule],
    })
    .overrideProvider(QuizAnswerService)
    .useValue(mockQuizAnswerService)
    .overrideProvider(LessonService)
    .useValue(mockLessonService)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/PUT /quiz_answer/{id}', () => {
    return request(app.getHttpServer())
      .put('/quiz_answer/' + quizanswerData[0].id)
      .set('Accept', 'application/json')
      .send(quizanswerData[0])
      .expect(200);
  });

  it('/DELETE /quiz_answer/{id}', () => {
    return request(app.getHttpServer())
      .delete('/quiz_answer/' + quizanswerData[0].id)
      .set('Accept', 'application/json')
      .expect(200);
  });

  afterAll(() => {
    app.close();
  });
});
