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
import { CategoryController } from '../src/modules/category/category.controller';
import { Category } from '../src/modules/category/category.entity';
import { CategoryModule } from '../src/modules/category/category.module';
import { CategoryService } from '../src/modules/category/category.service';
import { SubCategory } from '../src/modules/subCategory/subCategory.entity';

describe('Category (e2e)', () => {
  let app: INestApplication;

  const categoryData: Partial<Category> = {
    name: 'NAME',
    description: 'DESCRIPTION',
    image_id: 'CONTENT_ID',
  };

  let categoryId: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Category, SubCategory],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Category]),
        CategoryModule,
        HttpModule,
      ],
      providers: [CategoryService],
      controllers: [CategoryController],
      exports: [CategoryService],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new ErrorFilter(Logger));
    await app.init();
  });

  it('/GET /category', () => {
    return request(app.getHttpServer())
      .get('/category')
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
      });
  });

  it('/POST /category', () => {
    return request(app.getHttpServer())
      .post('/category')
      .set('Accept', 'application/json')
      .send(categoryData)
      .expect(201)
      .then(({ body }) => {
        expect(body.id).toBeDefined();

        categoryId = body.id;
      });
  });

  it('/GET /category/{id}', () => {
    return request(app.getHttpServer())
      .get('/category/' + categoryId)
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
      });
  });

  it('/PUT /category/{id}', () => {
    return request(app.getHttpServer())
      .put('/category/' + categoryId)
      .set('Accept', 'application/json')
      .send(categoryData)
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
      });
  });

  it('/PATCH /category/{id}', () => {
    return request(app.getHttpServer())
      .patch('/category/' + categoryId)
      .set('Accept', 'application/json')
      .send(categoryData)
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
      });
  });

  it('/DELETE /category/{id}', () => {
    return request(app.getHttpServer())
      .delete('/category/' + categoryId)
      .set('Accept', 'application/json')
      .send(categoryData)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
