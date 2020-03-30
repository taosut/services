// import { ErrorFilter } from '@magishift/util/dist';
// import { HttpModule, INestApplication, Logger } from '@nestjs/common';
// import { Test } from '@nestjs/testing';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import dotenv = require('dotenv');
// import * as request from 'supertest';
// import {
//   EInstitutionTypes,
//   IOrganization
// } from '../src/interfaces/organization.interface';
// import { OrganizationController } from '../src/organization.controller';
// import { Organization } from '../src/organization.entity';
// import { OrganizationMapper } from '../src/organization.mapper';
// import { OrganizationService } from '../src/organization.service';
// import { AccountService } from '../src/organizationUser/account.service';
// import { UserRole } from '../src/organizationUser/organizationRole/organizationRole.entity';
// import { UserController } from '../src/organizationUser/organizationUser.controller';
// import { User } from '../src/organizationUser/organizationUser.entity';
// import { UserMapper } from '../src/organizationUser/organizationUser.mapper';
// import { UserService } from '../src/organizationUser/organizationUser.service';

// const { parsed } = dotenv.config();

// process.env = { ...parsed, ...process.env };

// describe('Test User CRUD', () => {
//   let app: INestApplication;

//   const organizationFixture: IOrganization = {
//     institutionType: EInstitutionTypes.sekolah,
//     name: 'Test',
//     slug: null,
//     totalStudent: 10,
//     province: 'Jakarta',
//     city: 'Jakarta Selatan',
//     address: 'Tebet',
//     picName: 'Test PIC',
//     picKtpNumber: 'PIC01234',
//     phoneNumber: '08123456789',
//     email: 'test@test.com',
//     akta: '123456',
//     skKemenkumham: '123456',
//     skdp: '123456',
//     tdp: '123456',
//     siup: '123456',
//     npwp: '123456',
//     directorKtpNumber: '123456',
//   };

//   let newOrganization: IOrganization;
//   let newOrganizationId: string;
//   let newOrganizationSlug: string;

//   const fixture = {
//     accountId: null,
//     email: 'teste2e@teste2e.com',
//     phoneNumber: '08100000000',
//     username: 'teste2e',
//     password: 'test123e2e',
//     passwordConfirm: 'test123e2e',
//     enabled: true,
//     emailVerified: true,
//     firstName: 'FirstName',
//     lastName: 'Test E2E',
//     realmRoles: [],
//     organization: null,
//   };

//   let newUserId: string;

//   let newAccountId: string;

//   let updatedFixture: any;

//   beforeAll(async () => {
//     const module = await Test.createTestingModule({
//       imports: [
//         TypeOrmModule.forRoot({
//           type: 'sqlite',
//           database: ':memory:',
//           entities: [User, UserRole, Organization],
//           synchronize: true,
//         }),
//         TypeOrmModule.forFeature([User, UserRole, Organization]),
//         HttpModule,
//       ],
//       controllers: [UserController, OrganizationController],
//       providers: [
//         UserService,
//         UserMapper,
//         OrganizationService,
//         OrganizationMapper,
//         AccountService,
//       ],
//     }).compile();

//     app = module.createNestApplication();
//     app.useGlobalFilters(new ErrorFilter(Logger));

//     await app.init();
//   });

//   it(`POST /organization create new organization`, () =>
//     request(app.getHttpServer())
//       .post('/organization')
//       .send(organizationFixture)
//       .set('Accept', 'application/json')
//       .expect(201)
//       .then(({ body }) => {
//         newOrganizationId = body.id;
//         newOrganizationSlug = body.slug;
//         newOrganization = body;
//       }));

//   it(`POST /organization/:org/user create new user`, () => {
//     fixture.organization = newOrganization;

//     return request(app.getHttpServer())
//       .post(`/organization/${newOrganizationSlug}/user`)
//       .send(fixture)
//       .set('Accept', 'application/json')
//       .expect(201)
//       .then(({ body }) => {
//         expect(body.id).toBeDefined();
//         expect(body.accountId).toBeDefined();

//         newUserId = body.id;
//         newAccountId = body.accountId;
//       });
//   });

//   it(`GET /organization/:org/user to fetch all users`, () =>
//     request(app.getHttpServer())
//       .get(`/organization/${newOrganizationSlug}/user`)
//       .expect(200)
//       .expect('Content-Type', /json/)
//       .then(({ body }) => {
//         expect(typeof body.totalCount).toBe('number');
//         expect(Array.isArray(body.items)).toBe(true);
//         expect(body.items.length).toBeGreaterThan(0);
//       }));

//   it(`GET /organization/:org/user/:id to fetch created user`, () =>
//     request(app.getHttpServer())
//       .get(`/organization/${newOrganizationSlug}/user/${newUserId}`)
//       .expect(200)
//       .expect('Content-Type', /json/)
//       .then(({ body }) => {
//         expect(body.organization.id).toBe(newOrganizationId);
//       }));

//   it(`PATCH /organization/:org/user/:id update existing user`, () => {
//     updatedFixture = Object.assign(fixture);

//     updatedFixture.accountId = newAccountId;
//     updatedFixture.firstName = 'Updated test name';

//     return request(app.getHttpServer())
//       .patch(`/organization/${newOrganizationSlug}/user/${newUserId}`)
//       .send(updatedFixture)
//       .set('Accept', 'application/json')
//       .expect(200)
//       .then(({ body }) => {
//         expect(body.id).toBe(newUserId);
//         expect(body.accountId).toBe(newAccountId);
//         expect(body.email).toBe(updatedFixture.email);
//         expect(body.firstName).toBe(updatedFixture.firstName);
//       });
//   });

//   it(`GET /organization/:org/user/:id to fetch updated user`, () =>
//     request(app.getHttpServer())
//       .get(`/organization/${newOrganizationSlug}/user/${newUserId}`)
//       .expect(200)
//       .expect('Content-Type', /json/)
//       .then(({ body }) => {
//         expect(body.id).toBe(newUserId);
//         expect(body.accountId).toBe(newAccountId);
//         expect(body.email).toBe(updatedFixture.email);
//         expect(body.firstName).toBe(updatedFixture.firstName);
//       }));

//   it(`DELETE /organization/:org/user/:id soft delete new created user`, () =>
//     request(app.getHttpServer())
//       .delete(`/organization/${newOrganizationSlug}/user/${newUserId}`)
//       .set('Accept', 'application/json')
//       .expect(200));

//   it(`GET /organization/:org/user/:id get soft deleted user`, () => {
//     return request(app.getHttpServer())
//       .get(`/organization/${newOrganizationSlug}/user/${newUserId}`)
//       .set('Accept', 'application/json')
//       .expect(404);
//   });

//   it(`DELETE /organization/:id delete new created organization`, () => {
//     return request(app.getHttpServer())
//       .delete(`/organization/${newOrganizationId}`)
//       .set('Accept', 'application/json')
//       .expect(200);
//   });

//   it(`DELETE /organization/:org/user/:id purge user`, () =>
//     request(app.getHttpServer())
//       .delete(`/organization/${newOrganizationSlug}/user/${newUserId}/purge`)
//       .set('Accept', 'application/json')
//       .expect(200));

//   afterAll(async () => {
//     await app.close();
//   });
// });
