// import { ErrorFilter } from '@magishift/util';
// import { HttpModule, INestApplication, Logger } from '@nestjs/common';
// import { Test } from '@nestjs/testing';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import * as request from 'supertest';
// import uuid = require('uuid');
// import { InvoiceController } from '../src/invoice.old/invoice.controller';
// import { Invoice } from '../src/invoice.old/invoice.entity';
// import { InvoiceModule } from '../src/invoice.old/invoice.module';
// import { InvoiceService } from '../src/invoice.old/invoice.service';
// import { OrganizationService } from '../src/invoice.old/organization.service';
// import { invoiceSeed, updatedStatus } from './mock';

// describe('Testing Invoice', () => {
//   let app: INestApplication;

//   const organizationService = {
//     getOrganizationByOrganizationId: () => {
//       return {
//         data: { id: uuid() },
//       };
//     },
//   };

//   beforeAll(async () => {
//     const module = await Test.createTestingModule({
//       imports: [
//         TypeOrmModule.forRoot({
//           type: 'sqlite',
//           database: ':memory:',
//           entities: [Invoice],
//           synchronize: true,
//         }),
//         TypeOrmModule.forFeature([Invoice]),
//         InvoiceModule,
//         HttpModule,
//       ],
//       providers: [InvoiceService, OrganizationService],
//       controllers: [InvoiceController],
//       exports: [InvoiceService],
//     })
//       .overrideProvider(OrganizationService)
//       .useValue(organizationService)
//       .compile();

//     app = module.createNestApplication();
//     app.useGlobalFilters(new ErrorFilter(Logger));

//     await app.init();
//   });

//   it(`GET /invoice to fetch invoice list`, () => {
//     return request(app.getHttpServer())
//       .get('/invoice')
//       .expect(200)
//       .then(({ body }) => {
//         expect(Array.isArray(body)).toEqual(true);
//       });
//   });

//   it(`POST /invoice to create invoice`, () => {
//     return request(app.getHttpServer())
//       .post('/invoice')
//       .send(invoiceSeed)
//       .set('Accept', 'application/json')
//       .expect(201)
//       .then(({ body }) => {
//         expect(body.id).toBe(invoiceSeed.id);
//       });
//   });

//   it(`GET /invoice/${invoiceSeed.id} to fetch created invoice`, () => {
//     return request(app.getHttpServer())
//       .get(`/invoice/${invoiceSeed.id}`)
//       .expect(200)
//       .then(({ body }) => {
//         expect(body.id).toBe(invoiceSeed.id);
//       });
//   });

//   it(`PATCH /invoice/${
//     invoiceSeed.id
//   } update created invoice status to issued`, () => {
//     const updateData = invoiceSeed as any;
//     updateData.status = updatedStatus;

//     return request(app.getHttpServer())
//       .patch(`/invoice/${invoiceSeed.id}`)
//       .send(updateData)
//       .set('Accept', 'application/json')
//       .expect(200)
//       .then(({ body }) => {
//         expect(body.status).toBe(updatedStatus);
//       });
//   });

//   it(`PATCH /invoice/delete/${
//     invoiceSeed.id
//   } soft delete created invoice`, () => {
//     return request(app.getHttpServer())
//       .patch(`/invoice/delete/${invoiceSeed.id}`)
//       .set('Accept', 'application/json')
//       .expect(200)
//       .then(({ body }) => {
//         expect(body.isDeleted).toBe(true);
//       });
//   });

//   it(`DELETE /invoice/${invoiceSeed.id} delete created invoice`, () => {
//     return request(app.getHttpServer())
//       .delete(`/invoice/${invoiceSeed.id}`)
//       .set('Accept', 'application/json')
//       .expect(200);
//   });

//   it(`GET /invoice/${invoiceSeed.id} to fetch deleted invoice`, () => {
//     return request(app.getHttpServer())
//       .get(`/invoice/${invoiceSeed.id}`)
//       .expect(404);
//   });

//   afterAll(async () => {
//     await app.close();
//   });
// });
