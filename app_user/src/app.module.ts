import { HttpModule } from '@magishift/http/dist';
import { IRedisModuleOptions, RedisModule } from '@magishift/redis/dist';
import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv = require('dotenv');
import * as migrations from '../migrations';
import { entities } from './entities';
import { MembershipModule } from './membership/membership.module';
import { UserModule } from './user/user.module';

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env',
});

process.env = { ...parsed, ...process.env };

const redisConfig: IRedisModuleOptions = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
};

const dbConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.TYPEORM_HOST,
  password: process.env.TYPEORM_PASSWORD,
  username: process.env.TYPEORM_USERNAME,
  database: process.env.TYPEORM_DATABASE,
  port: Number(process.env.TYPEORM_PORT),
  entities,
  migrations: [migrations.initDb1561362567784],
  synchronize: false,
  migrationsRun: true,
};

@Module({
  imports: [
    RedisModule.register(redisConfig),
    TypeOrmModule.forRoot(dbConfig),
    HttpModule,
    UserModule,
    MembershipModule,
  ],
})
export class AppModule {}
