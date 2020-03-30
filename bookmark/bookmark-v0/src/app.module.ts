import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as migration from './migrations';
import { Bookmark } from './modules/bookmark/bookmark.entity';
import { BookmarkModule } from './modules/bookmark/bookmark.module';
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
    entities: [Bookmark],
    logging: Boolean(process.env.TYPEORM_LOGGING),
    synchronize: false,
    migrationsRun: true,
    migrations: [migration.initDb1570172957347],
  };
  @Module({
    imports: [TypeOrmModule.forRoot(dbConfig), BookmarkModule],
  })
  class AppModule {}

  return AppModule;
}
