import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ApplicationModule } from '../src/app.module';
import { ContentModule } from '../src/providers/content/content.module';
import { ContentService } from '../src/providers/content/content.service';
import { data as contentData } from '../src/database/seeders/content/data';
import { data as lessonData } from '../src/database/seeders/lesson/data';
import { mockContentService } from './mock/content.mock';
import { LessonService } from '../src/providers/lesson/lesson.service';
import { mockLessonService } from './mock/lesson.mock';

describe('ContentController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [ApplicationModule, ContentModule],
    })
    .overrideProvider(ContentService)
    .useValue(mockContentService)
    .overrideProvider(LessonService)
    .useValue(mockLessonService)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/PUT /lesson/{slug}/content', () => {
    return request(app.getHttpServer())
      .put('/lesson/' + lessonData[0].id + '/content')
      .set('Accept', 'application/json')
      .send(contentData[0])
      .expect(200);
  });

  // it('/POST /lesson/{slug}/attachment', () => {
  //   return request(app.getHttpServer())
  //     .post('/lesson/' + lessonData[0].id + '/attachment')
  //     .set('Accept', 'application/json')
  //     .send(contentData[0])
  //     .expect(200);
  // });

  afterAll(() => {
    app.close();
  });
});
