import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { QuizAttemptDetailService } from "./quizattemptdetail.service";
import { QuizAttemptDetail } from "../../models/quizattemptdetail/quizattemptdetail.entity";

/**
 * Import and provide seeder classes for languages.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forFeature([QuizAttemptDetail])],
  providers: [QuizAttemptDetailService],
  exports: [QuizAttemptDetailService],
})
export class QuizAttemptDetailModule {}