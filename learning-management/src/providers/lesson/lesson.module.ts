import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { LessonService } from "./lesson.service";
import { Lesson } from "../../models/lesson/lesson.entity";
import { LessonController } from "../../controllers/lesson/lesson.controller";

/**
 * Import and provide seeder classes for languages.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forFeature([Lesson])],
  providers: [LessonService],
  controllers: [LessonController],
  exports: [LessonService],
})
export class LessonModule {}