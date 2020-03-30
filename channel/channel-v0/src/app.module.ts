import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as migrations from './migrations';
import { Account } from './modules/channel/account/account.entity';
import { AccountModule } from './modules/channel/account/account.module';
import { Channel } from './modules/channel/channel.entity';
import { ChannelModule } from './modules/channel/channel.module';

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
    entities: [Channel, Account],
    logging: Boolean(process.env.TYPEORM_LOGGING),
    synchronize: false,
    migrationsRun: true,
    migrations: [migrations.initDb1571870778708],
  };

  @Module({
    imports: [TypeOrmModule.forRoot(dbConfig), ChannelModule, AccountModule],
  })
  class AppModule {}

  return AppModule;
}
