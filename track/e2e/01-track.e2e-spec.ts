import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { ErrorFilter } from '@magishift/util';
import { TrackGuard } from '../src/guards/track.guard';
import { Track } from '../src/track/track.entity';
import { ormconfig } from './ormconfig';

describe('TrackController (e2e)', () => {
  let app: INestApplication;

  const trackData: Partial<Track> = {
    title: 'Final Test 1',
    description: null,
    published: false,
    sort_order: 1,
  };

  let trackId: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule(ormconfig)
      .overrideGuard(TrackGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new ErrorFilter(Logger));
    await app.init();
  });

  it('/GET /tracks', () => {
    return request(app.getHttpServer())
      .get('/tracks')
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
      });
  });

  it('/Post /tracks', () => {
    return request(app.getHttpServer())
      .post('/tracks')
      .set('Accept', 'application/json')
      .send(trackData)
      .expect(201)
      .then(({ body }) => {
        expect(body.id).toBeDefined();

        trackId = body.id;
      });
  });

  it('/GET /tracks/{id}', () => {
    return request(app.getHttpServer())
      .get('/tracks/' + trackId)
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
      });
  });

  // it('/GET /tracks/{id}/learnings', () => {
  //   return request(app.getHttpServer())
  //     .get('/tracks/' + trackId + '/learnings')
  //     .set('Accept', 'application/json')
  //     .send(trackData)
  //     .expect(200);
  // });

  it('/POST /tracks/{id}/learnings', () => {
    return request(app.getHttpServer())
      .post('/tracks/' + trackId + '/learnings')
      .set('Accept', 'application/json')
      .send({
        add_ids: [],
        remove_ids: [],
      })
      .expect(200);
  });

  it('/PUT /tracks/{id}', () => {
    return request(app.getHttpServer())
      .put('/tracks/' + trackId)
      .set('Accept', 'application/json')
      .send(trackData)
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
      });
  });

  it('/DELETE /tracks/{id}/soft', () => {
    return request(app.getHttpServer())
      .delete('/tracks/' + trackId + '/soft')
      .set('Accept', 'application/json')
      .send(trackData)
      .expect(200);
  });

  it('/DELETE /tracks/{id}', () => {
    return request(app.getHttpServer())
      .delete('/tracks/' + trackId)
      .set('Accept', 'application/json')
      .send(trackData)
      .expect(200);
  });
});
