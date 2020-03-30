import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { ErrorFilter } from '@magishift/util';
import { Certificate } from '../src/certificate/certificate.entity';
import { ormconfig } from './ormconfig';

describe('CertificateController (e2e)', () => {
  let app: INestApplication;

  const certificateData: Partial<Certificate> = {
    class: {
      id: 'CLASS_ID',
    },
    user: {
      id: 'USER_ID',
    },
    completion: {
      id: 'COMPLETION_ID',
    },
  };

  let certificateId: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule(ormconfig).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new ErrorFilter(Logger));
    await app.init();
  });

  it('/POST /certificates', () => {
    return request(app.getHttpServer())
      .post('/certificates')
      .set('Accept', 'application/json')
      .send(certificateData)
      .expect(201)
      .then(({ body }) => {
        expect(body.id).toBeDefined();

        certificateId = body.id;
      });
  });

  it('/GET /certificates', () => {
    return request(app.getHttpServer())
      .get('/certificates')
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
      });
  });

  it('/GET /certificates/{id}', () => {
    return request(app.getHttpServer())
      .get('/certificates/' + certificateId)
      .set('Accept', 'application/json')
      .expect(200);
  });

  afterAll(() => {
    app.close();
  });
});
