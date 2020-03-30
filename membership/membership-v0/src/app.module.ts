import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ClassMembership } from './classMembership/classMembership.entity';
import { ClassMembershipModule } from './classMembership/classMembership.module';
import * as migration from './migrations';

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
    entities: [ClassMembership],
    logging: Boolean(process.env.TYPEORM_LOGGING),
    synchronize: false,
    migrationsRun: true,
    migrations: [migration.InitDB1568607980040],
  };

  @Module({
    imports: [TypeOrmModule.forRoot(dbConfig), ClassMembershipModule],
  })
  class MainModule {}

  return MainModule;
}
