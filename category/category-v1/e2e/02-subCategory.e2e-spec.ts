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
import { Category } from '../src/modules/category/category.entity';
import { CategoryModule } from '../src/modules/category/category.module';
import { SubCategoryController } from '../src/modules/subCategory/subCategory.controller';
import { SubCategory } from '../src/modules/subCategory/subCategory.entity';
import { SubCategoryModule } from '../src/modules/subCategory/subCategory.module';
import { SubCategoryService } from '../src/modules/subCategory/subCategory.service';

describe('Sub Category (e2e)', () => {
  let app: INestApplication;

  const categoryData: Partial<SubCategory> = {
    name: 'CATEGORY NAME',
    description: 'DESCRIPTION',
    image_id: 'CONTENT_ID',
  };

  const subCategoryData: Partial<SubCategory> = {
    name: 'SUB CATEGORY NAME',
    description: 'DESCRIPTION',
    image_id: 'CONTENT_ID',
    category_id: 'CATEGORY_ID',
  };

  let subCategoryId: string;
  let categoryId: string;
  let categorySlug: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Category, SubCategory],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([SubCategory]),
        SubCategoryModule,
        CategoryModule,

        HttpModule,
      ],
      providers: [SubCategoryService],
      controllers: [SubCategoryController],
      exports: [SubCategoryService],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new ErrorFilter(Logger));
    await app.init();
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
        categorySlug = body.slug;
        subCategoryData.category_id = body.id;
      });
  });

  it('/GET /sub-category', () => {
    return request(app.getHttpServer())
      .get(`/category/${categorySlug}/sub-category`)
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
      });
  });

  it(`/POST category/${categorySlug}/sub-category`, () => {
    return request(app.getHttpServer())
      .post(`/category/${categorySlug}/sub-category`)
      .set('Accept', 'application/json')
      .send(subCategoryData)
      .expect(201)
      .then(({ body }) => {
        expect(body.id).toBeDefined();

        subCategoryId = body.id;
      });
  });

  it('/GET category/${categorySlug}/sub-category/{id}', () => {
    return request(app.getHttpServer())
      .get(`/category/${categorySlug}/sub-category/${subCategoryId}`)
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
      });
  });

  it('/PUT category/${categorySlug}/sub-category/sub-category/{id}', () => {
    return request(app.getHttpServer())
      .put(`/category/${categorySlug}/sub-category/${subCategoryId}`)
      .set('Accept', 'application/json')
      .send(subCategoryData)
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
      });
  });

  it('/PATCH category/${categorySlug}/sub-category/sub-category/{id}', () => {
    return request(app.getHttpServer())
      .patch(`/category/${categorySlug}/sub-category/${subCategoryId}`)
      .set('Accept', 'application/json')
      .send(subCategoryData)
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
      });
  });

  it('/DELETE /sub-category/{id}', () => {
    return request(app.getHttpServer())
      .delete(`/category/${categorySlug}/sub-category/${subCategoryId}`)
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/DELETE /category/{id}', () => {
    return request(app.getHttpServer())
      .delete('/category/' + categoryId)
      .set('Accept', 'application/json')
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
    await new Promise(resolve => setTimeout(() => resolve(), 500));
  });
});
