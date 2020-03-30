import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ApplicationModule } from '../src/app.module';
import { FinalExamModule } from '../src/providers/final_exam/final_exam.module';
import { FinalExamService } from '../src/providers/final_exam/final_exam.service';
import { data as finalExamData } from '../src/database/seeders/final_exam/data';
import { mockFinalExamService } from './mock/final_exam.mock';
import { FinalExamAttemptService } from '../src/providers/final_exam_attempt/final_exam_attempt.service';
import { FinalExamAttemptDetailService } from '../src/providers/final_exam_attempt_detail/final_exam_attempt_detail.service';
import { mockFinalExamAttemptService } from './mock/final_exam_attempt.mock';
import { mockFinalExamAttemptDetailService } from './mock/final_exam_attempt_detail.mock';

describe('LearnerFinalExamController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [ApplicationModule, FinalExamModule],
    })
    .overrideProvider(FinalExamService)
    .useValue(mockFinalExamService)
    .overrideProvider(FinalExamAttemptService)
    .useValue(mockFinalExamAttemptService)
    .overrideProvider(FinalExamAttemptDetailService)
    .useValue(mockFinalExamAttemptDetailService)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // it('/POST /learner/final_exam/{slug}/start', () => {
  //   return request(app.getHttpServer())
  //     .post('/learner/final_exam/' + finalExamData[0].id + '/start')
  //     .set('Accept', 'application/json')
  //     .expect(201);
  // });

  it('/POST /learner/final_exam/{slug}/submit', () => {
    return request(app.getHttpServer())
      .post('/learner/final_exam/' + finalExamData[0].id + '/submit')
      .set('Accept', 'application/json')
      .send({
          finished: true,
          choosen_answers: [],
      })
      .expect(400);
  });

  afterAll(() => {
    app.close();
  });
});
