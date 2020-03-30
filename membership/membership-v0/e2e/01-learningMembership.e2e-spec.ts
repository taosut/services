import { ErrorFilter } from '@magishift/util';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { LearningMembership } from '../src/learningMembership/learningMembership.entity';
import { ormconfig } from './ormconfig';

describe('ClassMembershipController (e2e)', () => {
  let app: INestApplication;

  const learningMembershipData: Partial<LearningMembership> = {
    user_id: 'USER_ID',
    class_id: 'CLASS_ID',
    has_joined: false,
    start: new Date(),
    expired: new Date(),
  };

  let classMembershipId: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule(ormconfig).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new ErrorFilter(Logger));
    await app.init();
  });

  it('/GET /memberships', () => {
    return request(app.getHttpServer())
      .get('/memberships')
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
      });
  });

  it('/POST /memberships', () => {
    return request(app.getHttpServer())
      .post('/memberships')
      .set('Accept', 'application/json')
      .send(classMembershipData)
      .expect(201)
      .then(({ body }) => {
        expect(body.id).toBeDefined();

        classMembershipId = body.id;
      });
  });

  it('/GET /memberships/{id}', () => {
    return request(app.getHttpServer())
      .get('/memberships/' + classMembershipId)
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
      });
  });

  it('/PUT /memberships/{id}', () => {
    return request(app.getHttpServer())
      .put('/memberships/' + classMembershipId)
      .set('Accept', 'application/json')
      .send(classMembershipData)
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
      });
  });

  it('/DELETE /memberships/{id}', () => {
    return request(app.getHttpServer())
      .delete('/memberships/' + classMembershipId)
      .set('Accept', 'application/json')
      .send(classMembershipData)
      .expect(200);
  });

  // create again
  it('/POST /memberships', () => {
    return request(app.getHttpServer())
      .post('/memberships')
      .set('Accept', 'application/json')
      .send(classMembershipData)
      .expect(201)
      .then(({ body }) => {
        expect(body.id).toBeDefined();

        classMembershipId = body.id;
      });
  });

  // additional function
  it('/PATCH /memberships/{classId}/join', () => {
    return request(app.getHttpServer())
      .patch('/memberships/' + classId + '/join')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${learnerToken}`)
      .expect(200);
  });

  it('/DELETE /memberships/{userId}/user', () => {
    return request(app.getHttpServer())
      .delete('/memberships/' + userId + '/user')
      .set('Accept', 'application/json')
      .expect(200);
  });

  // create again, then delete
  it('/POST /memberships', () => {
    return request(app.getHttpServer())
      .post('/memberships')
      .set('Accept', 'application/json')
      .send(classMembershipData)
      .expect(201)
      .then(({ body }) => {
        expect(body.id).toBeDefined();

        classMembershipId = body.id;
      });
  });
  it('/DELETE /memberships/{classId}/class', () => {
    return request(app.getHttpServer())
      .delete('/memberships/' + classId + '/class')
      .set('Accept', 'application/json')
      .expect(200);
  });
});
