import { ErrorFilter } from '@magishift/util';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import uuid = require('uuid');
import { Completion } from '../src/modules/completion/completion.entity';
import { GenerateCompletionDto } from '../src/modules/completion/types/completion.dto';
import { EUnitType } from '../src/modules/completion/types/unitType.enum';
import { ClassInvokeService } from '../src/services/class.service';
import { ExamInvokeService } from '../src/services/exam.service';
import { ExamQuestionInvokeService } from '../src/services/examQuestion.service';
import { MembershipInvokeService } from '../src/services/membership.service';
import { UnitInvokeService } from '../src/services/unit.service';
import { getUserId } from '../src/utils/auth';
import { ormconfig } from './ormconfig';

describe('CompletionController (e2e)', () => {
  let app: INestApplication;

  const token: string =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJjM2I4YmM2OS01MGZjLTQzN2YtYThmYy0zOTVkMmM0NjQ4NGMifQ.eyJqdGkiOiI2OGYwN2IxZi04NmM4LTRmOTItYjMzOS01ZDA2M2VmYjY4MjciLCJleHAiOjE1NjcwODQwMzYsIm5iZiI6MCwiaWF0IjoxNTY3MDQ4MDM2LCJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjg4ODgvYXV0aC9yZWFsbXMvYWdvcmEtZW50ZXJwcmlzZSIsInN1YiI6IjMwNGJiNWQ2LWE3NTItNGZjYy1hZTI4LTQ4ZmJmYjVkM2Y1NSIsInR5cCI6IlNlcmlhbGl6ZWQtSUQiLCJhdXRoX3RpbWUiOjAsInNlc3Npb25fc3RhdGUiOiI3YTVmMzJlNC05NTczLTQ5NmQtYjc3Zi03ZDE1YzI2MmFiMzgiLCJzdGF0ZV9jaGVja2VyIjoidWh5cjc3TFkxRVI1a29Ec2FMSXpBZS1LNWNSajQ2OF9BWFVlZ1RiYXByRSJ9.7oLpHy8_7YBhNMZZ87eZ5xHn4RL9zbQnFGk1GVFMzVo';

  const userId = getUserId(token);
  const classId = uuid.v4();
  const trackId = uuid.v4();
  const unitId = uuid.v4();
  const examId = uuid.v4();
  const realm = 'agora';

  const completionData: Partial<Completion> = {
    type: EUnitType.VIDEO,
    progress: '0',
    elapsed_time: 0,
    finished: false,
    user_id: userId,
    class_id: classId,
    track_id: trackId,
    unit_id: unitId,
  };

  const dataGenerateInitialCompletion: GenerateCompletionDto = {
    user_id: userId,
    class_id: classId,
  };

  const classData = {
    id: classId,
    tracks: [
      {
        id: trackId,
        units: [
          {
            id: unitId,
            type: 'Exam',
            title: 'Unit 1',
            exam_id: examId,
          },
          {
            id: uuid.v4(),
            type: 'Ebook',
            title: 'Unit 2',
          },
        ],
      },
    ],
  };
  const membershipData = {
    id: uuid.v4,
    class_id: classId,
    user_id: userId,
    has_joined: false,
    start: new Date(),
    expired: null,
  };

  const questionIds = [uuid.v4(), uuid.v4()];
  const examData = {
    id: examId,
    title: 'First Exam',
    duration: 3600,
    questions: [
      {
        id: questionIds[0],
        question: 'Question 1',
        exam_id: examId,
        answers: [
          {
            id: uuid.v4(),
            answer: 'Answer A',
            question_id: questionIds[0],
            correct: true,
          },
          {
            id: uuid.v4(),
            answer: 'Answer B',
            question_id: questionIds[0],
            correct: false,
          },
        ],
      },
      {
        id: questionIds[1],
        question: 'Question 2',
        exam_id: examId,
        answers: [
          {
            id: uuid.v4(),
            answer: 'Answer A',
            question_id: questionIds[1],
            correct: false,
          },
          {
            id: uuid.v4(),
            answer: 'Answer B',
            question_id: questionIds[1],
            correct: true,
          },
        ],
      },
    ],
  };
  const answerObject: any = {
    question_id: examData.questions[0].id,
    choosen_answer_ids: [examData.questions[0].answers[0].id],
  };

  const mockMembershipInvokeService: MembershipInvokeService = {
    find: () => Promise.resolve([membershipData]),
  };
  const mockClassInvokeService: ClassInvokeService = {
    find: () => Promise.resolve([classData]),
    findOne: () => Promise.resolve(classData),
    update: () => Promise.resolve(classData),
  };
  const mockUnitInvokeService: UnitInvokeService = {
    findOne: () => Promise.resolve(classData.tracks[0].units[0]),
  };
  const mockExamInvokeService: ExamInvokeService = {
    find: () => Promise.resolve([examData]),
    findOne: () => Promise.resolve(examData),
    findByQuery: () => Promise.resolve([examData]),
  };
  const mockExamQuestionInvokeService: ExamQuestionInvokeService = {
    find: () => Promise.resolve([examData.questions[0]]),
    findOne: () => Promise.resolve(examData.questions[0]),
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule(ormconfig)
      .overrideProvider(MembershipInvokeService)
      .useValue(mockMembershipInvokeService)
      .overrideProvider(ClassInvokeService)
      .useValue(mockClassInvokeService)
      .overrideProvider(UnitInvokeService)
      .useValue(mockUnitInvokeService)
      .overrideProvider(ExamInvokeService)
      .useValue(mockExamInvokeService)
      .overrideProvider(ExamQuestionInvokeService)
      .useValue(mockExamQuestionInvokeService)
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new ErrorFilter(Logger));
    await app.init();
  });

  it('/POST /completion/generate', () => {
    return request(app.getHttpServer())
      .post('/completion/generate')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send(dataGenerateInitialCompletion)
      .expect(201);
  });

  it('/PUT /completion', () => {
    return request(app.getHttpServer())
      .put('/completion')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send(completionData)
      .expect(200);
  });

  it('/GET /completion/:classId', () => {
    return request(app.getHttpServer())
      .get('/completion/' + classId)
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .expect(200);
  });

  it('/GET /completion/:classId/:trackId', () => {
    return request(app.getHttpServer())
      .get(`/completion/${classId}/${trackId}`)
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .expect(200);
  });

  it('/GET /completion/:classId/:trackId/:unitId', () => {
    return request(app.getHttpServer())
      .get(`/completion/${classId}/${trackId}/${unitId}`)
      .set('Accept', 'application/json')
      .set('Realm', realm)
      .set('Authorization', token)
      .expect(200);
  });

  // EXAM ATTEMPT
  it('/POST /completion/generate', () => {
    return request(app.getHttpServer())
      .post('/completion/generate')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send(dataGenerateInitialCompletion)
      .expect(201);
  });

  it('/POST /completion/{classId}/{trackId}/{unitId}/exam', () => {
    return request(app.getHttpServer())
      .post(`/completion/${classId}/${trackId}/${unitId}/exam`)
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .then(({ status, body, error }) => {
        if (status === 200 || status === 201) {
          expect(body).toBeDefined();
        } else {
          if (error.text === '"TIME\'S UP"') {
            return request(app.getHttpServer())
              .post(`/completion/${classId}/${trackId}/${unitId}`)
              .set('Accept', 'application/json')
              .then(res => {
                expect(res.body).toBeDefined();
              });
          }
        }
      });
  });

  it('/POST /completion/{classId}/{trackId}/{unitId}/exam/answer', () => {
    return request(app.getHttpServer())
      .post(`/completion/${classId}/${trackId}/${unitId}/exam/answer`)
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send(answerObject)
      .expect(201);
  });

  it('/POST /completion/{classId}/{trackId}/{unitId}/exam/answer/check', () => {
    return request(app.getHttpServer())
      .post(`/completion/${classId}/${trackId}/${unitId}/exam/answer/check`)
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send(answerObject)
      .expect(201);
  });

  it('/POST /completion/{classId}/{trackId}/{unitId}/exam/finish', () => {
    return request(app.getHttpServer())
      .post(`/completion/${classId}/${trackId}/${unitId}/exam/finish`)
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .expect(200);
  });

  afterAll(() => {
    app.close();
  });
});
