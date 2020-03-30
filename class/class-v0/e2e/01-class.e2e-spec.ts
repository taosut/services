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
import uuid = require('uuid');
import { ClassController } from '../src/modules/class/class.controller';
import { Class } from '../src/modules/class/class.entity';
import { ClassModule } from '../src/modules/class/class.module';
import { ClassService } from '../src/modules/class/class.service';
import { ClassDto } from '../src/modules/class/types/class.dto';
import { EClassType } from '../src/modules/class/types/class.enum';
import { Track } from '../src/modules/track/track.entity';
import { TrackModule } from '../src/modules/track/track.module';
import { AudioTrack } from '../src/modules/unit/audioTrack/audioTrack.entity';
import { Ebook } from '../src/modules/unit/ebook/ebook.entity';
import { Unit } from '../src/modules/unit/unit.entity';
import { MembershipsInvokeService } from '../src/services/invokes/membership.service';

describe('Class (e2e)', () => {
  let app: INestApplication;

  const classData: Partial<ClassDto> = {
    title: 'TITLE',
    description: 'DESCRIPTION',
    term_and_condition: 'TERM AND CONDITION',
    published: true,
    approved: true,
    premium: true,
    featured: true,
    featured_file_id: 'FEATURED_FILE_ID',
    preview_file_id: 'PREVIEW_FILE_ID',
    user_id: 'USER_ID',
    publisher_id: 'PUBLISHER_ID',
    enrolled: 0,
    type: EClassType.course,
    length: 'LENGTH',
    effort: 'EFFORT',
    index_tracks: ['INDEX_TRACK_01', 'INDEX_TRACK_02', 'INDEX_TRACK_03'],
    syllabus: ['SYLLABUS_01', 'SYLLABUS_02', 'SYLLABUS_03'],
  };

  let classId: string;

  const membershipData = {
    id: uuid.v4,
    class_id: classId,
    user_id: uuid.v4(),
    has_joined: false,
    start: new Date(),
    expired: null,
  };

  const mockMembershipInvokeService: MembershipsInvokeService = {
    find: () => Promise.resolve([membershipData]),
    findOne: () => Promise.resolve([membershipData]),
    deleteAllByClass: () => Promise.resolve([true]),
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          // type: 'sqlite',
          type: 'mysql',
          host: 'localhost',
          password: 'secret-progress',
          username: 'agora',
          database: 'class_service',
          port: 3306,
          // database: ':memory:',
          entities: [Class, Track, Unit, Ebook, AudioTrack],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Class]),
        ClassModule,
        forwardRef(() => TrackModule),
        HttpModule,
      ],
      providers: [ClassService, MembershipsInvokeService],
      controllers: [ClassController],
      exports: [ClassService, MembershipsInvokeService],
    })
      .overrideProvider(MembershipsInvokeService)
      .useValue(mockMembershipInvokeService)
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new ErrorFilter(Logger));
    await app.init();
  });

  it('/GET /class', () => {
    return request(app.getHttpServer())
      .get('/class')
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
      });
  });

  it('/POST /class', () => {
    return request(app.getHttpServer())
      .post('/class')
      .set('Accept', 'application/json')
      .send(classData)
      .expect(201)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
        classId = body.id;
      });
  });

  it('/GET /class/{id}', () => {
    return request(app.getHttpServer())
      .get(`/class/${classId}`)
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
      });
  });

  it('/PUT /class/{id}', () => {
    return request(app.getHttpServer())
      .put(`/class/${classId}`)
      .set('Accept', 'application/json')
      .send(classData)
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
      });
  });

  it(`/PATCH /class/${classId}`, () => {
    return request(app.getHttpServer())
      .patch(`/class/${classId}`)
      .set('Accept', 'application/json')
      .send(classData)
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
      });
  });

  it(`/DELETE /class/${classId}`, () => {
    return request(app.getHttpServer())
      .delete(`/class/${classId}`)
      .set('Accept', 'application/json')
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
    await new Promise(resolve => setTimeout(() => resolve(), 500));
  });
});
