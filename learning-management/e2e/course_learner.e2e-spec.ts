import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ApplicationModule } from '../src/app.module';
import { CourseModule } from '../src/providers/course/course.module';
import { CourseService } from '../src/providers/course/course.service';
import { data as courseData } from '../src/database/seeders/course/data';
import { mockCourseService } from './mock/course.mock';
import { CourseUserService } from '../src/providers/courseuser/courseuser.service';
import { mockCourseUserService } from './mock/courseuser.mock';

describe('LearnerCourseController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [ApplicationModule, CourseModule],
    })
    .overrideProvider(CourseService)
    .useValue(mockCourseService)
    .overrideProvider(CourseUserService)
    .useValue(mockCourseUserService)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET /learner/course', () => {
    return request(app.getHttpServer())
      .get('/learner/course')
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/PUT /learner/course/{slug}/join', () => {
    return request(app.getHttpServer())
      .put('/learner/course/{slug}/join')
      .set('Accept', 'application/json')
      .expect(200);
  });

  afterAll(() => {
    app.close();
  });
});
