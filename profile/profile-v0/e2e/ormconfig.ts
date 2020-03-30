import { TypeOrmModule } from '@nestjs/typeorm';
import dotenv = require('dotenv');
import { Profile } from '../src/profile/profile.entity';
import { ProfileModule } from '../src/profile/profile.module';

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env.test',
});
process.env = { ...parsed, ...process.env };

export const ormconfig = {
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [Profile],
      synchronize: true,
    }),
    ProfileModule,
  ],
};
