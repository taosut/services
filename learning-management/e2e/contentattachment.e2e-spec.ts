import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ApplicationModule } from '../src/app.module';
import { ContentAttachmentModule } from '../src/providers/contentattachment/contentattachment.module';
import { ContentAttachmentService } from '../src/providers/contentattachment/contentattachment.service';
import { data as contentattachmentData } from '../src/database/seeders/contentattachment/data';
import { data as lessonData } from '../src/database/seeders/lesson/data';
import { mockContentAttachmentService } from './mock/contentattachment.mock';
import { LessonService } from '../src/providers/lesson/lesson.service';
import { mockLessonService } from './mock/lesson.mock';

describe('ContentAttachmentController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [ApplicationModule, ContentAttachmentModule],
    })
    .overrideProvider(ContentAttachmentService)
    .useValue(mockContentAttachmentService)
    .overrideProvider(LessonService)
    .useValue(mockLessonService)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/DELETE /contentattachment/{id}', () => {
    return request(app.getHttpServer())
      .delete('/contentattachment/' + lessonData[0].id)
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/GET /contentattachment/{id}', () => {
    return request(app.getHttpServer())
      .get('/contentattachment/' + lessonData[0].id)
      .set('Accept', 'application/json')
      .expect(200);
  });

  // it('/GET /contentattachment/{id}/download', () => {
  //   return request(app.getHttpServer())
  //     .get('/contentattachment/' + lessonData[0].id + '/download')
  //     .set('Accept', 'application/json')
  //     .expect(200);
  // });

  afterAll(() => {
    app.close();
  });
});
