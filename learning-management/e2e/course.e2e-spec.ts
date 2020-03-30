import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ApplicationModule } from '../src/app.module';
import { CourseModule } from '../src/providers/course/course.module';
import { CourseService } from '../src/providers/course/course.service';
import { data as courseData } from '../src/database/seeders/course/data';
import { mockCourseService } from './mock/course.mock';
import { PlaylistService } from '../src/providers/playlist/playlist.service';
import { mockPlaylistService } from './mock/playlist.mock';

describe('CourseController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [ApplicationModule, CourseModule],
    })
    .overrideProvider(CourseService)
    .useValue(mockCourseService)
    .overrideProvider(PlaylistService)
    .useValue(mockPlaylistService)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/POST /course', () => {
    return request(app.getHttpServer())
      .post('/course')
      .set('Accept', 'application/json')
      .send(courseData[0])
      .expect(201);
  });

  it('/GET /course', () => {
    return request(app.getHttpServer())
      .get('/course')
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/GET /course --no-paginate --keyword', () => {
    return request(app.getHttpServer())
      .get('/course?per_page=no-paginate&keyword=' + courseData[0].title)
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/GET /course --no-paginate --keyword-not-found', () => {
    return request(app.getHttpServer())
      .get('/course?per_page=no-paginate&keyword=' + courseData[0].title + '-not-found')
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/GET /course/{slug}', () => {
    return request(app.getHttpServer())
      .get('/course/' + courseData[0].slug)
      .set('Accept', 'application/json')
      .expect(200);
  });

  // it('/GET /course/{slug} --not-found', () => {
  //   return request(app.getHttpServer())
  //     .get('/course/test-not-found')
  //     .expect(404);
  // });

  it('/PUT /course/{id}', () => {
    return request(app.getHttpServer())
      .put('/course/' + courseData[0].id)
      .set('Accept', 'application/json')
      .send(courseData[0])
      .expect(200);
  });

  it('/PUT /course/{id}', () => {
    return request(app.getHttpServer())
      .put('/course/' + courseData[0].id)
      .set('Accept', 'application/json')
      .send(courseData[0])
      .expect(200);
  });

  it('/DELETE /course/{id}', () => {
    return request(app.getHttpServer())
      .delete('/course/' + courseData[0].id)
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/PUT /course/{id}/restore', () => {
    return request(app.getHttpServer())
      .put('/course/' + courseData[0].id + '/restore')
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/DELETE /course/{id}/force', () => { // will failed
    return request(app.getHttpServer())
      .delete('/course/' + courseData[0].id + '/force')
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/PATCH /course/{id}/approval', () => {
    return request(app.getHttpServer())
      .patch('/course/' + courseData[0].id + '/approval')
      .set('Accept', 'application/json')
      .send({approved: true})
      .expect(200);
  });

  // it('/PUT /course/{id}/change_image', () => {
  //   return request(app.getHttpServer())
  //     .put('/course/' + courseData[0].id + '/change_image')
  //     .set('Accept', 'application/json')
  //     .send({approved: true})
  //     .expect(200);
  // });

  it('/PATCH /course/{id}/order', () => {
    return request(app.getHttpServer())
      .patch('/course/' + courseData[0].id + '/order')
      .set('Accept', 'application/json')
      .send({sort_order: 1})
      .expect(200);
  });

  it('/GET /course/{id}/playlists', () => {
    return request(app.getHttpServer())
      .get('/course/' + courseData[0].id + '/playlists')
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/GET /course/{id}/playlists', () => {
    return request(app.getHttpServer())
      .get('/course/' + courseData[0].id + '/playlists')
      .set('Accept', 'application/json')
      .expect(200);
  });

  // it('/GET /course/{slug}/preview', () => {
  //   return request(app.getHttpServer())
  //     .get('/course/' + courseData[0].slug + '/preview')
  //     .set('Accept', 'application/json')
  //     .expect(200);
  // });

  it('/PATCH /course/{slug}/publication', () => {
    return request(app.getHttpServer())
      .patch('/course/' + courseData[0].slug + '/publication')
      .set('Accept', 'application/json')
      .send({published: true})
      .expect(200);
  });

  afterAll(() => {
    app.close();
  });
});
