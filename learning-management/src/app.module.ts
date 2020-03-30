import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackModule } from './providers/track/track.module';
import { CourseModule } from './providers/course/course.module';
import * as ormconfig from './ormconfig';
import { LoggerMiddleware } from './logger.middleware';
import { PlaylistModule } from './providers/playlist/playlist.module';
import { LessonModule } from './providers/lesson/lesson.module';
import { ContentModule } from './providers/content/content.module';
import { ContentAttachmentModule } from './providers/contentattachment/contentattachment.module';
import { CourseUserModule } from './providers/courseuser/courseuser.module';
import { QuizQuestionModule } from './providers/quizquestion/quizquestion.module';
import { QuizAnswerModule } from './providers/quizanswer/quizanswer.module';
import { QuizModule } from './providers/quiz/quiz.module';
import { LessonCompletionModule } from './providers/lessoncompletion/lessoncompletion.module';
import { PlaylistCompletionModule } from './providers/playlistcompletion/playlistcompletion.module';
import { CourseCompletionModule } from './providers/coursecompletion/coursecompletion.module';
import { LearnerCourseModule } from './providers/course/learner_course.module';
import { FinalExamModule } from './providers/final_exam/final_exam.module';
import { FinalExamQuestionModule } from './providers/final_exam_question/final_exam_question.module';
import { FinalExamAnswerModule } from './providers/final_exam_answer/final_exam_answer.module';
import { LearnerFinalExamModule } from './providers/learner_final_exam/learner_final_exam.module';
import { FinalExamAttemptModule } from './providers/final_exam_attempt/final_exam_attempt.module';
import { AuthorCourseModule } from './providers/course/author_course.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    TrackModule,
    CourseModule,
    CourseUserModule,
    PlaylistModule,
    LessonModule,
    ContentModule,
    ContentAttachmentModule,
    QuizModule,
    QuizQuestionModule,
    QuizAnswerModule,
    LessonCompletionModule,
    PlaylistCompletionModule,
    CourseCompletionModule,
    LearnerCourseModule,
    AuthorCourseModule,
    FinalExamModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class ApplicationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('cek');
  }
}
