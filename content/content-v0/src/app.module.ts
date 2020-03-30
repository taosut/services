import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as migrations from './migrations';
import { Content } from './modules/content/content.entity';
import { ContentModule } from './modules/content/content.module';

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
    entities: [Content],
    logging: Boolean(process.env.TYPEORM_LOGGING),
    synchronize: false,
    migrationsRun: true,
    migrations: [
      migrations.initDb1569364975308,
      migrations.initDb1570068451538,
    ],
  };
  @Module({
    imports: [TypeOrmModule.forRoot(dbConfig), ContentModule],
  })
  class AppModule {}

  return AppModule;
}
