import {
  forwardRef,
  HttpModule,
  INestApplication,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { ErrorFilter } from '@magishift/util';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearningCompletion } from '../src/modules/learningCompletion/learningCompletion.entity';
import { LessonCompletion } from '../src/modules/lessonCompletion/lessonCompletion.entity';
import { LessonCompletionModule } from '../src/modules/lessonCompletion/lessonCompletion.module';
import { PlaylistCompletionController } from '../src/modules/playlistCompletion/playlistCompletion.controller';
import { PlaylistCompletion } from '../src/modules/playlistCompletion/playlistCompletion.entity';
import { PlaylistCompletionModule } from '../src/modules/playlistCompletion/playlistCompletion.module';
import { PlaylistCompletionService } from '../src/modules/playlistCompletion/playlistCompletion.service';
import { PlaylistCompletionUpdateDto } from '../src/modules/playlistCompletion/types/playlistCompletion.types';
import { TrackCompletion } from '../src/modules/trackCompletion/trackCompletion.entity';
import { AttemptInvokeService } from '../src/services/attempt.service';
import { ClassInvokeService } from '../src/services/class.service';
import { PlaylistInvokeService } from '../src/services/playlist.service';

describe('PlaylistCompletionController (e2e)', () => {
  let app: INestApplication;

  const completionData: Partial<PlaylistCompletion> = {
    progress: '50',
    elapsed_time: 0,
    lecture_progress: '0',
    quiz_progress: '0',
    quiz_score: '0',
    quiz_rank: '0',
    overall_rank: '0',
    finished: true,
    playlist_id: 'PLAYLIST_ID',
    learning_id: 'LEARNING_ID',
    user_id: 'USER_ID',
  };

  const completionUpdateData: Partial<PlaylistCompletionUpdateDto> = {
    progress: '100',
  };

  let completionId: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [
            TrackCompletion,
            LearningCompletion,
            PlaylistCompletion,
            LessonCompletion,
          ],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([PlaylistCompletion]),
        PlaylistCompletionModule,
        forwardRef(() => LessonCompletionModule),
        HttpModule,
      ],
      providers: [
        PlaylistCompletionService,
        ClassInvokeService,
        PlaylistInvokeService,
        AttemptInvokeService,
      ],
      controllers: [PlaylistCompletionController],
      exports: [
        PlaylistCompletionService,
        ClassInvokeService,
        PlaylistInvokeService,
        AttemptInvokeService,
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new ErrorFilter(Logger));
    await app.init();
  });

  it('/GET /completion/playlist', () => {
    return request(app.getHttpServer())
      .get('/completion/playlist')
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
      });
  });

  it('/POST /completion/playlist', () => {
    return request(app.getHttpServer())
      .post('/completion/playlist')
      .set('Accept', 'application/json')
      .send(completionData)
      .expect(201)
      .then(({ body }) => {
        expect(body.id).toBeDefined();

        completionId = body.id;
      });
  });

  it('/GET /completion/playlist/{id}', () => {
    return request(app.getHttpServer())
      .get('/completion/playlist/' + completionId)
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
      });
  });

  it('/PUT /completion/playlist/{id}', () => {
    return request(app.getHttpServer())
      .put('/completion/playlist/' + completionId)
      .set('Accept', 'application/json')
      .send(completionUpdateData)
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
      });
  });

  it('/PATCH /completion/playlist/{id}', () => {
    return request(app.getHttpServer())
      .patch('/completion/playlist/' + completionId)
      .set('Accept', 'application/json')
      .send(completionUpdateData)
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
      });
  });

  it('/DELETE /completion/playlist/{id}', () => {
    return request(app.getHttpServer())
      .delete('/completion/playlist/' + completionId)
      .set('Accept', 'application/json')
      .send(completionData)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
    await new Promise(resolve => setTimeout(() => resolve(), 500));
  });
});
