import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FinalExamService } from '../final_exam/final_exam.service';
import { FinalExam } from '../../models/final_exam/final_exam.entity';
import { LearnerFinalExamController } from '../../controllers/learner_final_exam/learner_final_exam.controller';

/**
 * Import and provide seeder classes for languages.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forFeature([FinalExam])],
  providers: [FinalExamService],
  controllers: [LearnerFinalExamController],
  exports: [FinalExamService],
})
export class LearnerFinalExamModule {}
