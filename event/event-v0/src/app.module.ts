import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as migration from './migrations';
import { Event } from './modules/event/event.entity';
import { EventModule } from './modules/event/event.module';
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
    entities: [Event],
    logging: Boolean(process.env.TYPEORM_LOGGING),
    synchronize: false,
    migrationsRun: true,
    migrations: [migration.initDb1569893446186],
  };
  @Module({
    imports: [TypeOrmModule.forRoot(dbConfig), EventModule],
  })
  class AppModule {}

  return AppModule;
}
