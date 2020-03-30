import { Injectable, Logger } from '@nestjs/common';
import { TrackSeederService } from './track/track.service';
import { CourseSeederService } from './course/course.service';
import { PlaylistSeederService } from './playlist/playlist.service';
import { LessonSeederService } from './lesson/lesson.service';
import { ContentSeederService } from './content/content.service';
import { FinalExamSeederService } from './final_exam/final_exam.service';
import { FinalExamQuestionSeederService } from './final_exam_question/final_exam_question.service';
import { QuizQuestionSeederService } from './quizquestion/quizquestion.service';
import { QuizAnswerSeederService } from './quizanswer/quizanswer.service';
import { FinalExamAnswerSeederService } from './final_exam_answer/final_exam_answer.service';

@Injectable()
export class Seeder {
  constructor(
    private readonly logger: Logger,
    private readonly trackSeederService: TrackSeederService,
    private readonly courseSeederService: CourseSeederService,
    private readonly playlistSeederService: PlaylistSeederService,
    private readonly lessonSeederService: LessonSeederService,
    private readonly contentSeederService: ContentSeederService,
    private readonly quizQuestionSeederService: QuizQuestionSeederService,
    private readonly quizAnswerSeederService: QuizAnswerSeederService,
    private readonly finalExamSeederService: FinalExamSeederService,
    private readonly finalExamQuestionSeederService: FinalExamQuestionSeederService,
    private readonly finalExamAnswerSeederService: FinalExamAnswerSeederService,
  ) {}
  async seed() {
    await this.tracks()
      .then(completed => {
        this.logger.debug('Successfuly completed seeding tracks...');
        Promise.resolve(completed);
      })
      .catch(error => {
        this.logger.error('Failed seeding tracks...');
        Promise.reject(error);
      });
    await this.courses()
      .then(completed => {
        this.logger.debug('Successfuly completed seeding courses...');
        Promise.resolve(completed);
      })
      .catch(error => {
        this.logger.error('Failed seeding courses...');
        Promise.reject(error);
      });
    await this.playlists()
      .then(completed => {
        this.logger.debug('Successfuly completed seeding playlists...');
        Promise.resolve(completed);
      })
      .catch(error => {
        this.logger.error('Failed seeding playlists...');
        Promise.reject(error);
      });
    await this.lessons()
      .then(completed => {
        this.logger.debug('Successfuly completed seeding lessons...');
        Promise.resolve(completed);
      })
      .catch(error => {
        this.logger.error('Failed seeding lessons...');
        Promise.reject(error);
      });
    await this.contents()
      .then(completed => {
        this.logger.debug('Successfuly completed seeding contents...');
        Promise.resolve(completed);
      })
      .catch(error => {
        this.logger.error('Failed seeding contents...');
        Promise.reject(error);
      });
    await this.quizQuestions()
      .then(completed => {
        this.logger.debug('Successfuly completed seeding quiz questions...');
        Promise.resolve(completed);
      })
      .catch(error => {
        this.logger.error('Failed seeding quiz questions...');
        Promise.reject(error);
      });
    await this.quizAnswers()
      .then(completed => {
        this.logger.debug('Successfuly completed seeding quiz answers...');
        Promise.resolve(completed);
      })
      .catch(error => {
        this.logger.error('Failed seeding quiz answers...');
        Promise.reject(error);
      });
    await this.finalExams()
      .then(completed => {
        this.logger.debug('Successfuly completed seeding final exams...');
        Promise.resolve(completed);
      })
      .catch(error => {
        this.logger.error('Failed seeding final exams...');
        Promise.reject(error);
      });
    await this.finalExamQuestions()
      .then(completed => {
        this.logger.debug('Successfuly completed seeding final exam questions...');
        Promise.resolve(completed);
      })
      .catch(error => {
        this.logger.error('Failed seeding final exam questions...');
        Promise.reject(error);
      });
    await this.finalExamAnswers()
      .then(completed => {
        this.logger.debug('Successfuly completed seeding final exam answers...');
        Promise.resolve(completed);
      })
      .catch(error => {
        this.logger.error('Failed seeding final exam answers...');
        Promise.reject(error);
      });
  }
  async tracks() {
    return await Promise.all(this.trackSeederService.create())
      .then(createdTracks => {
        // Can also use this.logger.verbose('...');
        this.logger.debug(
          'No. of tracks created : ' +
            // Remove all null values and return only created tracks.
            createdTracks.filter(
              nullValueOrCreatedTracks => nullValueOrCreatedTracks,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }
  async courses() {
    return await Promise.all(this.courseSeederService.create())
      .then(createdCourses => {
        // Can also use this.logger.verbose('...');
        this.logger.debug(
          'No. of courses created : ' +
            // Remove all null values and return only created courses.
            createdCourses.filter(
              nullValueOrCreatedCourses => nullValueOrCreatedCourses,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }
  async playlists() {
    return await Promise.all(this.playlistSeederService.create())
      .then(createdPlaylists => {
        // Can also use this.logger.verbose('...');
        this.logger.debug(
          'No. of playlists created : ' +
            // Remove all null values and return only created playlists.
            createdPlaylists.filter(
              nullValueOrCreatedPlaylists => nullValueOrCreatedPlaylists,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }
  async lessons() {
    return await Promise.all(this.lessonSeederService.create())
      .then(createdLessons => {
        // Can also use this.logger.verbose('...');
        this.logger.debug(
          'No. of lessons created : ' +
            // Remove all null values and return only created lessons.
            createdLessons.filter(
              nullValueOrCreatedLessons => nullValueOrCreatedLessons,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }
  async contents() {
    return await Promise.all(this.contentSeederService.create())
      .then(createdContents => {
        // Can also use this.logger.verbose('...');
        this.logger.debug(
          'No. of contents created : ' +
            // Remove all null values and return only created contents.
            createdContents.filter(
              nullValueOrCreatedContents => nullValueOrCreatedContents,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }
  async quizQuestions() {
    return await Promise.all(this.quizQuestionSeederService.create())
      .then(createdQuizQuestions => {
        // Can also use this.logger.verbose('...');
        this.logger.debug(
          'No. of quizQuestions created : ' +
            // Remove all null values and return only created quizQuestions.
            createdQuizQuestions.filter(
              nullValueOrCreatedQuizQuestions => nullValueOrCreatedQuizQuestions,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }
  async quizAnswers() {
    return await Promise.all(this.quizAnswerSeederService.create())
      .then(createdQuizAnswers => {
        // Can also use this.logger.verbose('...');
        this.logger.debug(
          'No. of quizAnswers created : ' +
            // Remove all null values and return only created quizAnswers.
            createdQuizAnswers.filter(
              nullValueOrCreatedQuizAnswers => nullValueOrCreatedQuizAnswers,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }
  async finalExams() {
    return await Promise.all(this.finalExamSeederService.create())
      .then(createdFinalExams => {
        // Can also use this.logger.verbose('...');
        this.logger.debug(
          'No. of finalExams created : ' +
            // Remove all null values and return only created finalExams.
            createdFinalExams.filter(
              nullValueOrCreatedFinalExams => nullValueOrCreatedFinalExams,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }
  async finalExamQuestions() {
    return await Promise.all(this.finalExamQuestionSeederService.create())
      .then(createdFinalExamQuestions => {
        // Can also use this.logger.verbose('...');
        this.logger.debug(
          'No. of finalExamQuestions created : ' +
            // Remove all null values and return only created finalExamQuestions.
            createdFinalExamQuestions.filter(
              nullValueOrCreatedFinalExamQuestions => nullValueOrCreatedFinalExamQuestions,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }
  async finalExamAnswers() {
    return await Promise.all(this.finalExamAnswerSeederService.create())
      .then(createdFinalExamAnswers => {
        // Can also use this.logger.verbose('...');
        this.logger.debug(
          'No. of finalExamAnswers created : ' +
            // Remove all null values and return only created finalExamAnswers.
            createdFinalExamAnswers.filter(
              nullValueOrCreatedFinalExamAnswers => nullValueOrCreatedFinalExamAnswers,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }
}
