import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentInvokeService } from '../../../services/content.service';
import RedisService from '../../../services/redis.service';
import { QuestionModule } from '../question.module';
import { AnswerController } from './answer.controller';
import { Answer } from './answer.entity';
import { AnswerService } from './answer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Answer]), QuestionModule],
  providers: [AnswerService, ContentInvokeService, RedisService],
  controllers: [AnswerController],
  exports: [AnswerService],
})
export class AnswerModule {}
