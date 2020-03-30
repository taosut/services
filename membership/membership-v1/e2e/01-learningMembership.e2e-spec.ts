import { ErrorFilter } from '@magishift/util';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { ClassMembership } from '../src/classMembership/classMembership.entity';
import { CompletionInvokeService } from '../src/services/completion.service';
import { getUserId } from '../src/utils/auth';
import { ormconfig } from './ormconfig';

describe('ClassMembershipController (e2e)', () => {
  let app: INestApplication;

  // tslint:disable-next-line: max-line-length
  const learnerToken = `eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI4X2ZGRl92Nml6S0xpTUhkTDVEcUZ5MkRHSjdsRkVtMlI3YW1oWmtPNk93In0.eyJqdGkiOiIwN2NiOGY4Ny1kNTZjLTRhNTMtYTI1Ni0wNjU0YWZhY2Y1NjAiLCJleHAiOjE1NzAxNDA3MTMsIm5iZiI6MCwiaWF0IjoxNTY4ODI2NzEzLCJpc3MiOiJodHRwczovL2FjY291bnRzLmFwcC1kZXYuYWdvcmEuaWQvYXV0aC9yZWFsbXMvYWdvcmEiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiYzcxNjViZTgtN2Y2OS00NzA1LWJlNjMtNWM1OWVhZmQxZjVmIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYWdvcmEtY2xpZW50IiwiYXV0aF90aW1lIjowLCJzZXNzaW9uX3N0YXRlIjoiMzk5ZWRlMDctYmY4OS00MzEwLWI5YjYtYjgzODNhYWRiNDM2IiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyIqIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsImxlYXJuZXIiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoiZW1haWwgcHJvZmlsZSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiTGVhcm5lciBBZ29yYSIsInByZWZlcnJlZF91c2VybmFtZSI6ImxlYXJuZXIiLCJnaXZlbl9uYW1lIjoiTGVhcm5lciIsImZhbWlseV9uYW1lIjoiQWdvcmEiLCJlbWFpbCI6ImxlYXJuZXJAYWdvcmEuaWQifQ.QcA9lYEY53E7mGpmN2B8IVmz8oNTLC5gSyaZwxaOQEmi0xoB4zflsYDsBZhmNO4c9IbIcLo4qEoDdpLcrc64bq81_wZ0yDfJMbE_q264l77kht8YFpDIZyO-Z1zC85uA_JXH0N1zemVpG9WbdMNS2gcG7RdUpFqJWVoTdhe0n_ruCk0fNfcOzYZCTGLurb6XhC3Nk-0rYxA0oHoEySg-Zs4btMTals5A8LTmTZDLZO99moTpsLjH-5X-NyELwuCv8ulKWN0tOkITm9vprmwL5tjwc2M0WO-Uspzs_KCLOFOy6RbuaqfTHpR_t1ZQtNmoHS-7pIxbX3k9b252NI4J7w`;
  const userId = getUserId(`Bearer ${learnerToken}`);
  const classId = 'CLASS_ID';
  const classMembershipData: Partial<ClassMembership> = {
    user_id: userId,
    class_id: classId,
    has_joined: false,
    start: new Date(),
    expired: new Date(),
  };

  let classMembershipId: string;

  const mockCompletionInvokeService: CompletionInvokeService = {
    find: () => Promise.resolve([classMembershipData]),
    generateInitialCompletion: () => Promise.resolve(classMembershipData),
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule(ormconfig)
      .overrideProvider(CompletionInvokeService)
      .useValue(mockCompletionInvokeService)
      .compile();

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
  it('/POST /learner/memberships/{classId}/start', () => {
    return request(app.getHttpServer())
      .post('/learner/memberships/' + classId + '/start')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${learnerToken}`)
      .expect(201);
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
