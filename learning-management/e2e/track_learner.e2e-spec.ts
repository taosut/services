import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ApplicationModule } from '../src/app.module';
import { TrackModule } from '../src/providers/track/track.module';
import { TrackService } from '../src/providers/track/track.service';
import { data as trackData } from '../src/database/seeders/track/data';
import { mockTrackService } from './mock/track.mock';
import { CourseService } from '../src/providers/course/course.service';
import { mockCourseService } from './mock/course.mock';

describe('LearnerTrackController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [ApplicationModule, TrackModule],
    })
    .overrideProvider(TrackService)
    .useValue(mockTrackService)
    .overrideProvider(CourseService)
    .useValue(mockCourseService)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET /learner/track', () => {
    return request(app.getHttpServer())
      .get('/learner/track')
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/GET /learner/track/{slug}/courses', () => {
    return request(app.getHttpServer())
      .get('/learner/track/{slug}/courses')
      .set('Accept', 'application/json')
      .expect(200);
  });

  afterAll(() => {
    app.close();
  });
});
