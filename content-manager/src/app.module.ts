import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as migrations from '../src/migrations';
import { Content } from './content/content.entity';
import { ContentModule } from './content/content.module';

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
      migrations.initDb21564633379128,
      migrations.initDb21565145644006,
    ],
  };
  @Module({
    imports: [TypeOrmModule.forRoot(dbConfig), ContentModule],
  })
  class AppModule {}

  return AppModule;
}
