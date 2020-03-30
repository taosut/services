import { Module, Logger } from '@nestjs/common';
import { ApplicationModule } from '../../app.module';
import { Seeder } from './seeder';
import { TrackSeederService } from './track/track.service';
import { TrackSeederModule } from './track/track.module';
import { CourseSeederService } from './course/course.service';
import { CourseSeederModule } from './course/course.module';
import { PlaylistSeederService } from './playlist/playlist.service';
import { PlaylistSeederModule } from './playlist/playlist.module';
import { LessonSeederModule } from './lesson/lesson.module';
import { LessonSeederService } from './lesson/lesson.service';
import { ContentSeederModule } from './content/content.module';
import { ContentSeederService } from '../../database/seeders/content/content.service';
import { FinalExamSeederModule } from './final_exam/final_exam.module';
import { FinalExamSeederService } from '../../database/seeders/final_exam/final_exam.service';
import { FinalExamQuestionSeederModule } from './final_exam_question/final_exam_question.module';
import { FinalExamQuestionSeederService } from './final_exam_question/final_exam_question.service';
import { QuizQuestionSeederService } from './quizquestion/quizquestion.service';
import { QuizAnswerSeederService } from './quizanswer/quizanswer.service';
import { QuizQuestionSeederModule } from './quizquestion/quizquestion.module';
import { QuizAnswerSeederModule } from './quizanswer/quizanswer.module';
import { FinalExamAnswerSeederModule } from './final_exam_answer/final_exam_answer.module';
import { FinalExamAnswerSeederService } from './final_exam_answer/final_exam_answer.service';

/**
 * Import and provide seeder classes.
 *
 * @module
 */
@Module({
    imports: [
      ApplicationModule,
      TrackSeederModule, CourseSeederModule, PlaylistSeederModule, LessonSeederModule, ContentSeederModule,
      QuizQuestionSeederModule, QuizAnswerSeederModule,
      FinalExamSeederModule, FinalExamQuestionSeederModule, FinalExamAnswerSeederModule,
    ],
    providers: [
      TrackSeederService, CourseSeederService, PlaylistSeederService, LessonSeederService, ContentSeederService,
      QuizQuestionSeederService, QuizAnswerSeederService,
      FinalExamSeederService, FinalExamQuestionSeederService, FinalExamAnswerSeederService,
      Logger, Seeder,
    ],
    // providers: [MysqlSeederService, Logger, Seeder],
  })
  export class SeederModule {}
