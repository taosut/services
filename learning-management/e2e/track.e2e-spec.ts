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

describe('TrackController (e2e)', () => {
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

  it('/POST /track', () => {
    return request(app.getHttpServer())
      .post('/track')
      .set('Accept', 'application/json')
      .send(trackData[0])
      .expect(201);
  });

  it('/GET /track', () => {
    return request(app.getHttpServer())
      .get('/track')
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/GET /track --no-paginate --keyword', () => {
    return request(app.getHttpServer())
      .get('/track?per_page=no-paginate&keyword=' + trackData[0].title)
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/GET /track --no-paginate --keyword-not-found', () => {
    return request(app.getHttpServer())
      .get('/track?per_page=no-paginate&keyword=' + trackData[0].title + '-not-found')
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/GET /track/{slug}', () => {
    return request(app.getHttpServer())
      .get('/track/' + trackData[0].slug)
      .set('Accept', 'application/json')
      .expect(200);
  });

  // it('/GET /track/{slug} --not-found', () => {
  //   return request(app.getHttpServer())
  //     .get('/track/test-not-found')
  //     .expect(404);
  // });

  it('/PUT /track/{id}', () => {
    return request(app.getHttpServer())
      .put('/track/' + trackData[0].id)
      .set('Accept', 'application/json')
      .send(trackData[0])
      .expect(200);
  });

  it('/PUT /track/{slug}', () => {
    return request(app.getHttpServer())
      .put('/track/' + trackData[0].slug)
      .set('Accept', 'application/json')
      .send(trackData[0])
      .expect(200);
  });

  it('/DELETE /track/{id}', () => {
    return request(app.getHttpServer())
      .delete('/track/{id}')
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/PUT /track/{id}/restore', () => {
    return request(app.getHttpServer())
      .put('/track/{id}/restore')
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/DELETE /track/{id}/force', () => {
    return request(app.getHttpServer())
      .delete('/track/{id}/force')
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/PUT /track/{id}/addcourse', () => {
    return request(app.getHttpServer())
      .put('/track/' + trackData[0].id + '/addcourse')
      .set('Accept', 'application/json')
      .send({courses: []})
      .expect(200);
  });

  it('/PUT /track/{id}/removecourse', () => {
    return request(app.getHttpServer())
      .put('/track/' + trackData[0].id + '/removecourse')
      .set('Accept', 'application/json')
      .send({courses: []})
      .expect(200);
  });

  // it('/PUT /track/{id}/change_image', () => {
  //   return request(app.getHttpServer())
  //     .put('/track/' + trackData[0].id + '/change_image')
  //     .set('Accept', 'application/json')
  //     // .send({courses: []})
  //     .expect(200);
  // });

  it('/PATCH /track/{id}/order', () => {
    return request(app.getHttpServer())
      .patch('/track/' + trackData[0].id + '/order')
      .set('Accept', 'application/json')
      .send({sort_order: 1})
      .expect(200);
  });

  it('/GET /track/{slug}/courses', () => {
    return request(app.getHttpServer())
      .get('/track/' + trackData[0].slug + '/courses')
      .set('Accept', 'application/json')
      .expect(200);
  });

  // it('/GET /track/{slug}/preview/{key}', () => {
  //   return request(app.getHttpServer())
  //     .get('/track/' + trackData[0].slug + '/preview/abcdef')
  //     .set('Accept', 'application/json')
  //     .expect(200);
  // });

  afterAll(() => {
    app.close();
  });
});
