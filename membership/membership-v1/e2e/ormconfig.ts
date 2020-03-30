import { TypeOrmModule } from '@nestjs/typeorm';
import dotenv = require('dotenv');
import { ClassMembership } from '../src/classMembership/classMembership.entity';
import { ClassMembershipModule } from '../src/classMembership/classMembership.module';

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env.test',
});
process.env = { ...parsed, ...process.env };

export const ormconfig = {
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [ClassMembership],
      synchronize: true,
    }),
    ClassMembershipModule,
  ],
};
