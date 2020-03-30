import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentInvokeService } from '../../services/content.service';
import RedisService from '../../services/redis.service';
import { QuestionController } from './question.controller';
import { Question } from './question.entity';
import { QuestionService } from './question.service';

@Module({
  imports: [TypeOrmModule.forFeature([Question])],
  providers: [QuestionService, ContentInvokeService, RedisService],
  controllers: [QuestionController],
  exports: [QuestionService],
})
export class QuestionModule {}
