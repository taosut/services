import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as migration from './migrations';
import { Completion } from './modules/completion/completion.entity';
import { CompletionModule } from './modules/completion/completion.module';

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
    entities: [Completion],
    logging: Boolean(process.env.TYPEORM_LOGGING),
    synchronize: false,
    migrationsRun: true,
    migrations: [migration.InitDB1569411371786],
  };
  @Module({
    imports: [TypeOrmModule.forRoot(dbConfig), CompletionModule],
  })
  class AppModule {}

  return AppModule;
}
