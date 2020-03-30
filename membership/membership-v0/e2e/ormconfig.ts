import { TypeOrmModule } from '@nestjs/typeorm';
import dotenv = require('dotenv');
import { LearningMembership } from '../src/learningMembership/learningMembership.entity';
import { LearningMembershipModule } from '../src/learningMembership/learningMembership.module';

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env.test',
});
process.env = { ...parsed, ...process.env };

export const ormconfig = {
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [LearningMembership],
      synchronize: true,
    }),
    LearningMembershipModule,
  ],
};
