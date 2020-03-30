import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FinalExamSeederService } from './final_exam.service';
import { FinalExam } from '../../../models/final_exam/final_exam.entity';

/**
 * Import and provide seeder classes for languages.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forFeature([FinalExam])],
  providers: [FinalExamSeederService],
  exports: [FinalExamSeederService],
})
export class FinalExamSeederModule {}
