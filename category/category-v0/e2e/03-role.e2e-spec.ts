// import { ErrorFilter } from '@magishift/util';
// import { HttpModule, INestApplication, Logger } from '@nestjs/common';
// import dotenv = require('dotenv');
// import * as request from 'supertest';
// import { Test } from '@nestjs/testing';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import {
//   EInstitutionTypes,
//   IOrganization
// } from '../src/interfaces/organization.interface';
// import { OrganizationController } from '../src/organization.controller';
// import { Organization } from '../src/organization.entity';
// import { OrganizationMapper } from '../src/organization.mapper';
// import { OrganizationService } from '../src/organization.service';
// import { UserRoleController } from '../src/organizationUser/organizationRole/organizationRole.controller';
// import { UserRole } from '../src/organizationUser/organizationRole/organizationRole.entity';
// import { UserRoleMapper } from '../src/organizationUser/organizationRole/organizationRole.mapper';
// import { UserRoleService } from '../src/organizationUser/organizationRole/organizationRole.service';
// import { User } from '../src/organizationUser/organizationUser.entity';

// const { parsed } = dotenv.config();

// process.env = { ...parsed, ...process.env };

// describe('Test Role CRUD', () => {
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
//     name: 'TestE2e',
//     description: 'Test e2e Role',
//     organization: null,
//   };

//   let newRoleId: string;

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
//       controllers: [UserRoleController, OrganizationController],
//       providers: [
//         UserRoleService,
//         UserRoleMapper,
//         OrganizationService,
//         OrganizationMapper,
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

//   it(`POST /organization/:org/role create new role`, () => {
//     fixture.organization = newOrganization;

//     return request(app.getHttpServer())
//       .post(`/organization/${newOrganizationSlug}/role`)
//       .send(fixture)
//       .set('Accept', 'application/json')
//       .expect(201)
//       .then(({ body }) => {
//         expect(body.id).toBeDefined();

//         newRoleId = body.id;
//       });
//   });

//   it(`GET /organization/:org/role to fetch all roles`, () =>
//     request(app.getHttpServer())
//       .get(`/organization/${newOrganizationSlug}/role`)
//       .expect(200)
//       .expect('Content-Type', /json/)
//       .then(({ body }) => {
//         expect(typeof body.totalCount).toBe('number');
//         expect(Array.isArray(body.items)).toBe(true);
//         expect(body.items.length).toBeGreaterThan(0);
//       }));

//   it(`GET /organization/:org/role/:id to fetch created role`, () =>
//     request(app.getHttpServer())
//       .get(`/organization/${newOrganizationSlug}/role/${newRoleId}`)
//       .expect(200)
//       .expect('Content-Type', /json/)
//       .then(({ body }) => {
//         expect(body.organization.id).toBe(newOrganizationId);
//       }));

//   it(`PATCH /organization/:org/role/:id update existing role`, () => {
//     updatedFixture = Object.assign(fixture);

//     updatedFixture.name = 'Updated test name';

//     return request(app.getHttpServer())
//       .patch(`/organization/${newOrganizationSlug}/role/${newRoleId}`)
//       .send(updatedFixture)
//       .set('Accept', 'application/json')
//       .expect(200)
//       .then(({ body }) => {
//         expect(body.id).toBe(newRoleId);
//         expect(body.name).toBe(updatedFixture.name);
//       });
//   });

//   it(`GET /organization/:org/role/:id to fetch updated role`, () =>
//     request(app.getHttpServer())
//       .get(`/organization/${newOrganizationSlug}/role/${newRoleId}`)
//       .expect(200)
//       .expect('Content-Type', /json/)
//       .then(({ body }) => {
//         expect(body.id).toBe(newRoleId);
//         expect(body.name).toBe(updatedFixture.name);
//       }));

//   it(`DELETE /organization/:org/role/:id soft delete new created role`, () =>
//     request(app.getHttpServer())
//       .delete(`/organization/${newOrganizationSlug}/role/${newRoleId}`)
//       .set('Accept', 'application/json')
//       .expect(200));

//   it(`GET /organization/:org/role/:id get soft deleted role`, () => {
//     return request(app.getHttpServer())
//       .get(`/organization/${newOrganizationSlug}/role/${newRoleId}`)
//       .set('Accept', 'application/json')
//       .expect(404);
//   });

//   it(`DELETE /organization/:id delete new created organization`, () => {
//     return request(app.getHttpServer())
//       .delete(`/organization/${newOrganizationId}`)
//       .set('Accept', 'application/json')
//       .expect(200);
//   });

//   afterAll(async () => {
//     await app.close();
//   });
// });
