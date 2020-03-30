import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ApplicationModule } from '../src/app.module';
import { QuizModule } from '../src/providers/quiz/quiz.module';
import { LessonService } from '../src/providers/lesson/lesson.service';
import { data as quizData } from '../src/database/seeders/lesson/data';
import { mockLessonService } from './mock/lesson.mock';

describe('QuizController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [ApplicationModule, QuizModule],
    })
    .overrideProvider(LessonService)
    .useValue(mockLessonService)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET /quiz/{slug}', () => {
    return request(app.getHttpServer())
      .get('/quiz/' + quizData[2].slug)
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/GET /quiz/{slug}/questions', () => {
    return request(app.getHttpServer())
      .get('/quiz/' + quizData[2].slug + '/questions')
      .set('Accept', 'application/json')
      .expect(200);
  });

  // it('/GET /quiz/{slug}/start', () => {
  //   return request(app.getHttpServer())
  //     .get('/quiz/' + quizData[2].slug + '/start')
  //     .set('Accept', 'application/json')
  //     .expect(200);
  // });

  // it('/POST /quiz/{slug}/submit', () => {
  //   return request(app.getHttpServer())
  //     .post('/quiz/' + quizData[2].slug + '/submit')
  //     .set('Accept', 'application/json')
  //     .send({ finished: true, choosen_answers: []})
  //     .expect(200);
  // });

  afterAll(() => {
    app.close();
  });
});
