import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as migration from './migrations';
import { Category } from './modules/category/category.entity';
import { CategoryModule } from './modules/category/category.module';
import { SubCategory } from './modules/subCategory/subCategory.entity';
import { SubCategoryModule } from './modules/subCategory/subCategory.module';

export function moduleFactory(
  host: string,
  password: string,
  username: string,
  port: number
): any {
  const dbConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host,
    password,
    username,
    database: process.env.TYPEORM_DATABASE,
    port,
    entities: [Category, SubCategory],
    logging: Boolean(process.env.TYPEORM_LOGGING),
    synchronize: false,
    migrationsRun: true,
    migrations: [migration.initDb1569290401652, migration.initDb1569550298431],
  };
  @Module({
    imports: [
      TypeOrmModule.forRoot(dbConfig),
      CategoryModule,
      SubCategoryModule,
    ],
  })
  class AppModule {}

  return AppModule;
}
