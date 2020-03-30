import {
  HttpModule,
  INestApplication,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { ErrorFilter } from '@magishift/util';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from '../src/modules/class/class.entity';
import { ClassModule } from '../src/modules/class/class.module';
import { ClassDto } from '../src/modules/class/types/class.dto';
import { EClassType } from '../src/modules/class/types/class.enum';
import { Track } from '../src/modules/track/track.entity';
import { TrackModule } from '../src/modules/track/track.module';
import { TrackDto } from '../src/modules/track/types/track.dto';
import { AudioTrack } from '../src/modules/unit/audioTrack/audioTrack.entity';
import { EbookController } from '../src/modules/unit/ebook/ebook.controller';
import { EbookDto } from '../src/modules/unit/ebook/ebook.dto';
import { Ebook } from '../src/modules/unit/ebook/ebook.entity';
import { EbookModule } from '../src/modules/unit/ebook/ebook.module';
import { EbookService } from '../src/modules/unit/ebook/ebook.service';
import { EUnitType } from '../src/modules/unit/types/unit.const';
import { UnitDto } from '../src/modules/unit/types/unit.dto';
import { Unit } from '../src/modules/unit/unit.entity';
import { UnitModule } from '../src/modules/unit/unit.module';
describe('Ebook (e2e)', () => {
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

  const trackData: Partial<TrackDto> = {
    title: 'TITLE',
    description: 'DESCRIPTION',
    duration: 0,
    class_id: 'CLASS_ID',
  };

  let trackId: string;

  const unitData: Partial<UnitDto> = {
    title: 'TITLE',
    description: 'DESCRIPTION',
    type: EUnitType.exam,
    exam_id: 'EXAM_ID',
  };

  let unitId: string;

  const ebookData: Partial<EbookDto> = {
    title: 'TITLE EBOOK',
    content: '<p>CONTENT<p>',
    page_number: 1,
    unit_id: 'UNIT_ID',
  };

  let ebookId: string;

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
        TypeOrmModule.forFeature([Ebook]),
        UnitModule,
        TrackModule,
        ClassModule,
        EbookModule,
        HttpModule,
      ],
      providers: [EbookService],
      controllers: [EbookController],
      exports: [EbookService],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new ErrorFilter(Logger));
    await app.init();
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

  it('/POST /class/{classId}/track', () => {
    return request(app.getHttpServer())
      .post(`/class/${classId}/track`)
      .set('Accept', 'application/json')
      .send(trackData)
      .expect(201)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
        trackId = body.id;
      });
  });

  it('/POST /track/{trackId}/unit', () => {
    return request(app.getHttpServer())
      .post(`/track/${trackId}/unit`)
      .set('Accept', 'application/json')
      .send(unitData)
      .expect(201)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
        unitId = body.id;
      });
  });

  it('/GET /unit/{unitId}/ebook', () => {
    return request(app.getHttpServer())
      .get(`/unit/${unitId}/ebook`)
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
      });
  });

  it('/POST /unit/${unitId}/ebook', () => {
    return request(app.getHttpServer())
      .post(`/unit/${unitId}/ebook`)
      .set('Accept', 'application/json')
      .send(ebookData)
      .expect(201)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
        ebookId = body.id;
      });
  });

  it('/GET /unit/${unitId}/ebook/{id}', () => {
    return request(app.getHttpServer())
      .get(`/unit/${unitId}/ebook/${ebookId}`)
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
      });
  });

  it('/PUT /unit/${unitId}/ebook/{id}', () => {
    return request(app.getHttpServer())
      .put(`/unit/${unitId}/ebook/${ebookId}`)
      .set('Accept', 'application/json')
      .send(ebookData)
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
      });
  });

  it('/PATCH /unit/${unitId}/ebook/{id}', () => {
    return request(app.getHttpServer())
      .patch(`/unit/${unitId}/ebook/${ebookId}`)
      .set('Accept', 'application/json')
      .send(ebookData)
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
      });
  });

  it('/DELETE /unit/${unitId}/ebook/{id}', () => {
    return request(app.getHttpServer())
      .delete(`/unit/${unitId}/ebook/${ebookId}`)
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/DELETE /track/{classId}/unit/{id}', () => {
    return request(app.getHttpServer())
      .delete(`/track/${trackId}/unit/${unitId}`)
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/DELETE /class/{classId}/track/{id}', () => {
    return request(app.getHttpServer())
      .delete(`/class/${classId}/track/${trackId}`)
      .set('Accept', 'application/json')
      .expect(200);
  });

  // it('/DELETE /class/{classId}', () => {
  //   return request(app.getHttpServer())
  //     .delete(`/class/${classId}`)
  //     .set('Accept', 'application/json')
  //     .expect(200);
  // });

  afterAll(async () => {
    await app.close();
    await new Promise(resolve => setTimeout(() => resolve(), 500));
  });
});
