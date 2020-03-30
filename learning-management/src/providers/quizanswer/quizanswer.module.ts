import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { QuizAnswerService } from "./quizanswer.service";
import { QuizAnswer } from "../../models/quizanswer/quizanswer.entity";
import { QuizAnswerController } from "../../controllers/quizanswer/quizanswer.controller";

/**
 * Import and provide seeder classes for languages.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forFeature([QuizAnswer])],
  providers: [QuizAnswerService],
  controllers: [QuizAnswerController],
  exports: [QuizAnswerService],
})
export class QuizAnswerModule {}