import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentInvokeService } from '../services/content.service';
import RedisService from '../services/redis.service';
import { ExamController } from './exam.controller';
import { Exam } from './exam.entity';
import { ExamService } from './exam.service';

@Module({
  imports: [TypeOrmModule.forFeature([Exam])],
  providers: [ExamService, ContentInvokeService, RedisService],
  controllers: [ExamController],
  exports: [ExamService],
})
export class ExamModule {}
