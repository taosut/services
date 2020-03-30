import {ConnectionOptions} from 'typeorm';
import { Track } from './models/track/track.entity';
import * as migration from './database/migrations';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';
import { Course } from './models/course/course.entity';
import { Playlist } from './models/playlist/playlist.entity';
import { Lesson } from './models/lesson/lesson.entity';
import { Content } from './models/content/content.entity';
import { ContentAttachment } from './models/contentattachment/contentattachment.entity';
import { QuizQuestion } from './models/quizquestion/quizquestion.entity';
import { QuizAnswer } from './models/quizanswer/quizanswer.entity';
import { QuizAttempt } from './models/quizattempt/quizattempt.entity';
import { QuizAttemptDetail } from './models/quizattemptdetail/quizattemptdetail.entity';
import { CourseUser } from './models/courseuser/courseuser.entity';
import { LessonCompletion } from './models/lessoncompletion/lessoncompletion.entity';
import { PlaylistCompletion } from './models/playlistcompletion/playlistcompletion.entity';
import { CourseCompletion } from './models/coursecompletion/coursecompletion.entity';
import { TrackCompletion } from './models/trackcompletion/trackcompletion.entity';
import { FinalExam } from './models/final_exam/final_exam.entity';
import { FinalExamQuestion } from './models/final_exam_question/final_exam_question.entity';
import { FinalExamAnswer } from './models/final_exam_answer/final_exam_answer.entity';
import { FinalExamAttempt } from './models/final_exam_attempt/final_exam_attempt.entity';
import { FinalExamAttemptDetail } from './models/final_exam_attempt_detail/final_exam_attempt_detail.entity';

const environment = process.env.NODE_ENV || 'development';
const data = dotenv.config({ path: `.env.${environment}` });
let env: any;
if (data) {
   env = data.parsed;
}
process.env = {
   ...process.env,
   ...env,
};
// Logger.debug('env');
// Logger.debug(env);
// Logger.debug('process env');
// Logger.debug(process.env);
// Check typeORM documentation for more information.
const config: ConnectionOptions = {
   type: 'postgres',
   host: process.env.DB_HOST,
   port: Number(process.env.DB_PORT),
   username: process.env.DB_USERNAME,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_DATABASE,
   entities: [
      Track, Course, Playlist, Lesson, Content, ContentAttachment,
      CourseUser,
      QuizQuestion, QuizAnswer, QuizAttempt, QuizAttemptDetail,
      LessonCompletion, PlaylistCompletion, CourseCompletion, TrackCompletion,
      FinalExam, FinalExamQuestion, FinalExamAnswer, FinalExamAttempt, FinalExamAttemptDetail,
   ],
   synchronize: false,
   migrationsRun: true,
   logging: true,
   logger: 'file',
   migrations: [
      migration.TrackMigration1560146505410,
      migration.CourseMigration1560147976901,
      migration.CourseUserMigration1560151926947,
      migration.PlaylistMigration1560149188139,
      migration.LessonMigration1560149630400,
      migration.ContentMigration1560151137599,
      migration.ContentAttachmentMigration1560151587622,
      migration.QuizQuestionMigration1560152341799,
      migration.QuizAnswerMigration1560154367377,
      migration.QuizAttemptMigration1560154639238,
      migration.QuizAttemptDetailMigration1560155273949,
      migration.TrackCompletionMigration1560157774271,
      migration.CourseCompletionMigration1560157633971,
      migration.PlaylistCompletionMigration1560157147302,
      migration.LessonCompletionMigration1560156576503,
      migration.FinalExamMigration1562308241638,
      migration.FinalExamQuestionMigration1562554170023,
      migration.FinalExamAnswerMigration1562554312014,
      migration.FinalExamAttemptMigration1562570262897,
      migration.FinalExamAttemptDetailMigration1562570383168,
   ],
   cli: {
      migrationsDir: 'src/database/migrations',
    },
 };

export = config;
