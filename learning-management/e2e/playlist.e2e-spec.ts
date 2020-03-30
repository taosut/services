import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ApplicationModule } from '../src/app.module';
import { PlaylistModule } from '../src/providers/playlist/playlist.module';
import { PlaylistService } from '../src/providers/playlist/playlist.service';
import { data as playlistData } from '../src/database/seeders/playlist/data';
import { mockPlaylistService } from './mock/playlist.mock';
import { mockLessonService } from './mock/lesson.mock';
import { LessonService } from '../src/providers/lesson/lesson.service';

describe('PlaylistController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [ApplicationModule, PlaylistModule],
    })
    .overrideProvider(PlaylistService)
    .useValue(mockPlaylistService)
    .overrideProvider(LessonService)
    .useValue(mockLessonService)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/POST /playlist', () => {
    return request(app.getHttpServer())
      .post('/playlist')
      .set('Accept', 'application/json')
      .send(playlistData[0])
      .expect(201);
  });

  it('/GET /playlist', () => {
    return request(app.getHttpServer())
      .get('/playlist')
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/GET /playlist --no-paginate --keyword', () => {
    return request(app.getHttpServer())
      .get('/playlist?per_page=no-paginate&keyword=' + playlistData[0].title)
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/GET /playlist --no-paginate --keyword-not-found', () => {
    return request(app.getHttpServer())
      .get('/playlist?per_page=no-paginate&keyword=' + playlistData[0].title + '-not-found')
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/GET /playlist/{slug}', () => {
    return request(app.getHttpServer())
      .get('/playlist/' + playlistData[0].slug)
      .set('Accept', 'application/json')
      .expect(200);
  });

  // it('/GET /playlist/{slug} --not-found', () => {
  //   return request(app.getHttpServer())
  //     .get('/playlist/test-not-found')
  //     .expect(404);
  // });

  it('/PUT /playlist/{id}', () => {
    return request(app.getHttpServer())
      .put('/playlist/' + playlistData[0].id)
      .set('Accept', 'application/json')
      .send(playlistData[0])
      .expect(200);
  });

  it('/PUT /playlist/{slug}', () => {
    return request(app.getHttpServer())
      .put('/playlist/' + playlistData[0].slug)
      .set('Accept', 'application/json')
      .send(playlistData[0])
      .expect(200);
  });

  it('/DELETE /playlist/{id}', () => {
    return request(app.getHttpServer())
      .delete('/playlist/{id}')
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/PUT /playlist/{id}/restore', () => {
    return request(app.getHttpServer())
      .put('/playlist/' + playlistData[0].id + '/restore')
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/DELETE /playlist/{id}/force', () => {
    return request(app.getHttpServer())
      .delete('/playlist/' + playlistData[0].id + '/force')
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/PATCH /playlist/{id}/order', () => {
    return request(app.getHttpServer())
      .patch('/playlist/' + playlistData[0].id + '/order')
      .set('Accept', 'application/json')
      .send({sort_order: 1})
      .expect(200);
  });

  it('/GET /playlist/{id}/lessons', () => {
    return request(app.getHttpServer())
      .get('/playlist/' + playlistData[0].id + '/lessons')
      .set('Accept', 'application/json')
      .expect(200);
  });

  afterAll(() => {
    app.close();
  });
});
