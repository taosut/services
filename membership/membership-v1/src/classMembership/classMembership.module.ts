import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompletionInvokeService } from '../services/completion.service';
import RedisService from '../services/redis.service';
import SNSService from '../services/sns.service';
import { ClassMembershipController } from './classMembership.controller';
import { ClassMembership } from './classMembership.entity';
import { ClassMembershipService } from './classMembership.service';
import { LearnerClassMembershipController } from './learner/learnerClassMembership.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ClassMembership]), CacheModule.register()],
  providers: [ClassMembershipService, CompletionInvokeService, RedisService, SNSService],
  controllers: [ClassMembershipController, LearnerClassMembershipController],
  exports: [ClassMembershipService],
})
export class ClassMembershipModule {}
