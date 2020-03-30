import { Controller, Get, Post, Body, Param,
  NotFoundException, BadRequestException, Query, Put, Delete, HttpException, Logger } from '@nestjs/common';
import { ApiImplicitParam, ApiImplicitQuery, ApiUseTags } from '@nestjs/swagger';
import { LessonCompletionService } from '../../providers/lessoncompletion/lessoncompletion.service';
import { LessonCompletion } from '../../models/lessoncompletion/lessoncompletion.entity';
import { CreateLessonCompletionDto, UpdateLessonCompletionDto } from '../../models/lessoncompletion/lessoncompletion.dto';
import { convertResponse, convertDate } from '../_plugins/converter';
import { LessonService } from '../../providers/lesson/lesson.service';
import * as validate from 'uuid-validate';
import { PlaylistCompletionService } from '../../providers/playlistcompletion/playlistcompletion.service';
import { QuizAttemptService } from '../../providers/quizattempt/quizattempt.service';
import { UpdatePlaylistCompletionDto } from '../../models/playlistcompletion/playlistcompletion.dto';
import { CreatePlaylistCompletionDto } from '../../models/playlistcompletion/playlistcompletion.dto';
import { PlaylistCompletion } from '../../models/playlistcompletion/playlistcompletion.entity';
import { PlaylistService } from '../../providers/playlist/playlist.service';
import { CourseCompletionService } from '../../providers/coursecompletion/coursecompletion.service';
import { CourseService } from '../../providers/course/course.service';
import { UpdateCourseCompletionDto, CreateCourseCompletionDto } from '../../models/coursecompletion/coursecompletion.dto';
import { CourseCompletion } from '../../models/coursecompletion/coursecompletion.entity';
import { TrackService } from '../../providers/track/track.service';
import { TrackCompletionService } from '../../providers/trackcompletion/trackcompletion.service';
import { TrackCompletion } from '../../models/trackcompletion/trackcompletion.entity';
import { CreateTrackCompletionDto, UpdateTrackCompletionDto } from '../../models/trackcompletion/trackcompletion.dto';
import { AuthService } from '../../_handler/auth/auth.service';

@ApiUseTags('Completion')
@Controller('lesson')
export class LessonCompletionController {
  private readonly authService: AuthService;
  constructor(private readonly lessonCompletionService: LessonCompletionService,
              private readonly lessonService: LessonService,
              private readonly playlistCompletionService: PlaylistCompletionService,
              private readonly quizAttemptService: QuizAttemptService,
              private readonly playlistService: PlaylistService,
              private readonly courseCompletionService: CourseCompletionService,
              private readonly courseService: CourseService,
              private readonly trackCompletionService: TrackCompletionService,
              private readonly trackService: TrackService,
            ) {}

  @Get(':slug/completion')
  @ApiImplicitParam({ name: 'slug', description: 'Slug can replace with id. Example : the-title or 049ddb16-9f0f-41a2-90e6-39b8768c8184' })
  async findOne(@Param('slug') slug): Promise<object> {
    const userId = await this.authService.getUserId('learner');
    let lesson;
    if (validate(slug)) {
      lesson = await this.lessonService.findOne({id: slug});

      if (!lesson) {
        throw new NotFoundException('Lesson is not Found');
      }
    } else {
      lesson = await this.lessonService.findOne({slug});

      if (!lesson) {
        throw new NotFoundException('Lesson is not Found');
      }
    }

    // Get Lesson Completion
    let result;
    result = await this.lessonCompletionService.findOne({lesson_id: lesson.id, user_id: userId});

    if (!result) {
      throw new NotFoundException('Lesson Completion is not found');
    }

    result = convertDate(result);
    return convertResponse(result);
  }

  @Put(':slug/completion')
  @ApiImplicitParam({ name: 'slug', description: 'Slug can replace with id. Example : the-title or 049ddb16-9f0f-41a2-90e6-39b8768c8184' })
  async update(@Param('slug') slug, @Body() createDto: CreateLessonCompletionDto): Promise<object> {
    Logger.debug('=== Lesson completion');
    try {
      const userId = await this.authService.getUserId('learner');
      const baseData = new LessonCompletion();
      let lesson;
      // check is lesson exist
      if (validate(slug)) {
        lesson = await this.lessonService.findOne({id: slug});

        if (!lesson) {
          throw new NotFoundException('Lesson is not Found');
        }
      } else {
        lesson = await this.lessonService.findOne({slug});

        if (!lesson) {
          throw new NotFoundException('Lesson is not Found');
        }
      }

      if (lesson.lesson_type === 'lecture' && !lesson.content) {
        throw new NotFoundException('There is no content');
      } else if (lesson.lesson_type !== 'lecture') {
        throw new NotFoundException('Cannot update completion on quiz');
      }

      let result;
      const isExist = await this.lessonCompletionService.findOne({lesson_id: lesson.id, user_id: userId});
      if (isExist) {
        // update
        let updateData: LessonCompletion;
        // only update when not yet finished
        if (!isExist.finished) {
          updateData = {
            ...isExist,
            elapsed_time: createDto.elapsed_time,
            progress: createDto.progress,
          };
        }
        // automatically set to finished when content is not video
        if ((lesson.content && !lesson.content.path) || Number(createDto.progress) === Number(100)
            || (lesson.content && (!lesson.content.video_source || !lesson.content.video_link))) {
          updateData = {
            ...updateData,
            progress: '100',
            finished: true,
          };
        }
        // automatically set to finished when content is video and progress more than boundary
        if (Number(updateData.progress) > 95) {
          updateData = {
            ...updateData,
            progress: '100',
            finished: true,
          };
        }
        result = await this.lessonCompletionService.update(isExist.id, updateData);
      } else {
        // create
        let createData: LessonCompletion = Object.assign(baseData, createDto);
        createData = {
          ...createData,
          user_id: userId,
          lesson_id: lesson.id,
        };
        result = await this.lessonCompletionService.create(createData);
      }

      Logger.debug('Result Lesson Completion');
      Logger.debug(result);
      // update playlist completion
      await this.updatePlaylistCompletion(lesson.playlist_id);

      result = convertDate(result);
      return convertResponse(result);
    } catch (error) {
      if (error.statusCode) {
        throw new HttpException(error.message, error.statusCode);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }

  // @Put(':playlist_id/playlist_update_completion')
  // @ApiImplicitParam({ name: 'playlist_id', description: 'Example : 049ddb16-9f0f-41a2-90e6-39b8768c8184' })
  async updatePlaylistCompletion(@Param('playlist_id') playlistId) {
    Logger.debug('=== Playlist completion');
    try {
      Logger.debug('Update Playlist Completion');
      const userId = await this.authService.getUserId('learner');
      // get list lecture that have content where playlist_id = x
      const listLectureWithContent = await this.lessonService.findAllLectureWhereParentWithContent({playlist_id: playlistId});
      const numLecture = listLectureWithContent.length;
      const numLectureFinished = 0;
      // get list quiz where playlist_id = x and quiz questions is not empty
      const listQuizWithQuestion = await this.lessonService.findAllQuizWhereParentWithQuestions({playlist_id: playlistId});
      const listQuizWhereHasQuestion = listQuizWithQuestion.filter(item => item.questions.length > 0);
      const numQuiz = listQuizWhereHasQuestion.length;
      let numQuizFinished = 0;

      let totalProgress: any = 0;
      let lectureProgress: any = 0;
      let quizProgress: any = 0;
      let quizScore: any = 0;
      let isAllFinished = true;
      // get list lesson completion where playlist_id = x && user_id = y
      const lessonCompletions = await this.lessonCompletionService.findAllWhereParent({playlist_id: playlistId, user_id: userId});

      for (const completion of lessonCompletions) {
        lectureProgress = Number(lectureProgress) + Number(completion.progress);
        totalProgress = Number(totalProgress) + Number(completion.progress);
        if (!completion.finished) {
          isAllFinished = false;
        }
      }
      const arrayCompletion = lessonCompletions.map(item => item.progress);
      Logger.debug('Lesson Completion > Progress : [' + arrayCompletion.join(', ') + ']');
      // get list quiz completion where playlist_id = x && user_id = y
      const listQuizAttempt = await this.quizAttemptService.findAllWhereParent({playlist_id: playlistId, user_id: userId});
      const listQuizAttemptFinished = listQuizAttempt.filter(item => item.finished);
      numQuizFinished = listQuizAttemptFinished.length;

      for (const attempt of listQuizAttempt) {
        if (attempt.finished) {
          totalProgress = Number(totalProgress) + 100;
          quizProgress = Number(quizProgress) + 100;
          quizScore = Number(quizScore) + Number(attempt.latest_score);
        } else {
          isAllFinished = false;
        }
      }
      // CALCULATE
      // Lecture Progress
      if (numLecture === 0) {
        lectureProgress = lectureProgress;
      } else {
        lectureProgress = (lectureProgress / numLecture).toFixed(2);
      }
      // Quiz Progress
      if (numQuiz === 0) {
        quizProgress = quizProgress;
      } else {
        quizProgress = (quizProgress / numQuiz).toFixed(2);
      }
      // Quiz Score
      if (numQuizFinished === 0) {
        quizScore = quizScore;
      } else {
        quizScore = (quizScore / numQuizFinished).toFixed(2);
      }
      // Total Progress
      if ((numLecture + numQuiz) === 0) {
        totalProgress = totalProgress;
      } else {
        totalProgress = (totalProgress / (numLecture + numQuiz)).toFixed(2);
      }

      let result;
      const isCompletionExist = await this.playlistCompletionService.findOne({playlist_id: playlistId, user_id: userId});
      if (isCompletionExist) {
        // update
        const updateData: PlaylistCompletion = {
          ...isCompletionExist,
          total_progress: totalProgress,
          lecture_progress: lectureProgress,
          quiz_progress: quizProgress,
          quiz_score: quizScore,
          finished: isAllFinished,
        };
        result = await this.playlistCompletionService.update(isCompletionExist.id, updateData);
      } else {
        // create
        const baseData = new PlaylistCompletion();
        const inputData: CreatePlaylistCompletionDto = {
          total_progress: totalProgress,
          lecture_progress: lectureProgress,
          quiz_progress: quizProgress,
          quiz_score: quizScore,
          finished: isAllFinished,
          quiz_rank: null,
          overall_rank: null,
          playlist_id: playlistId,
          user_id: userId,
        };
        const createData = Object.assign(baseData, inputData);
        result = await this.playlistCompletionService.create(createData);
      }

      Logger.debug('Result Playlist Completion');
      Logger.debug(result);
      // update course completion
      const playlist = await this.playlistService.findOne({id: playlistId});
      if (playlist) {
        await this.updateCourseCompletion(playlist.course_id);
      }
      result = convertDate(result);
      return convertResponse(result);
    } catch (error) {
      if (error.statusCode) {
        throw new HttpException(error.message, error.statusCode);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }

  // @Put(':course_id/course_update_completion')
  // @ApiImplicitParam({ name: 'course_id', description: 'Example : 049ddb16-9f0f-41a2-90e6-39b8768c8184' })
  async updateCourseCompletion(@Param('course_id') courseId) {
    Logger.debug('=== Course completion');
    try {
      Logger.debug('Update Course Completion');
      const userId = await this.authService.getUserId('learner');
      // get list playlist contain lecture that have content where course_id = x
      const listPlaylistWithLecture = await this.playlistService.findAllPlaylistWithLectureWhereParentWithContent({course_id: courseId});
      const listPlaylistWithLectureHasContent = listPlaylistWithLecture.filter(item => item.lessons.length > 0);
      const numLecture = listPlaylistWithLecture.length;
      const numLectureFinished = 0;

      // get list playlist contain quiz that have content where course_id = x
      const listPlaylistWithQuiz = await this.playlistService.findAllPlaylistWithQuizWhereParentWithQuestions({course_id: courseId});
      const listPlaylistWithQuizHasQuestions = listPlaylistWithQuiz.filter(item => item.lessons.length > 0);
      const numQuiz = listPlaylistWithQuizHasQuestions.length;
      const numQuizFinished = 0;

      let totalProgress: any = 0;
      let lectureProgress: any = 0;
      let quizProgress: any = 0;
      let quizScore: any = 0;
      let isAllFinished = true;
      // get list playlist completion (lecture) where course_id = x && user_id = y
      for (const playlist of listPlaylistWithLectureHasContent) {
        const playlistCompletion = await this.playlistCompletionService.findOne({playlist_id: playlist.id, user_id: userId});
        if (playlistCompletion) {
          totalProgress = Number(totalProgress) + Number(playlistCompletion.total_progress);
          lectureProgress = Number(lectureProgress) + Number(playlistCompletion.lecture_progress);
        } else {
          isAllFinished = false;
        }
      }
      // get list playlist completion (quiz) where course_id = x && user_id = y
      for (const playlist of listPlaylistWithQuizHasQuestions) {
        const playlistCompletion = await this.playlistCompletionService.findOne({playlist_id: playlist.id, user_id: userId});
        if (playlistCompletion) {
          totalProgress = Number(totalProgress) + Number(playlistCompletion.total_progress);
          quizProgress = Number(quizProgress) + Number(playlistCompletion.quiz_progress);
          quizScore = Number(quizScore) + Number(playlistCompletion.quiz_score);
        } else {
          isAllFinished = false;
        }
      }
      // CALCULATE
      // Lecture Progress
      if (numLecture === 0) {
        lectureProgress = lectureProgress;
      } else {
        lectureProgress = (lectureProgress / numLecture).toFixed(2);
      }
      // Quiz Progress
      if (numQuiz === 0) {
        quizProgress = quizProgress;
      } else {
        quizProgress = (quizProgress / numQuiz).toFixed(2);
      }
      // Quiz Score
      if (numQuizFinished === 0) {
        quizScore = quizScore;
      } else {
        quizScore = (quizScore / numQuizFinished).toFixed(2);
      }
      // Total Progress
      if ((numLecture + numQuiz) === 0) {
        totalProgress = totalProgress;
      } else {
        totalProgress = (totalProgress / (numLecture + numQuiz)).toFixed(2);
      }

      let result;
      const isCompletionExist = await this.courseCompletionService.findOne({course_id: courseId, user_id: userId});
      if (isCompletionExist) {
        // update
        const updateData: CourseCompletion = {
          ...isCompletionExist,
          total_progress: totalProgress,
          lecture_progress: lectureProgress,
          quiz_progress: quizProgress,
          quiz_score: quizScore,
          finished: isAllFinished,
        };
        result = await this.courseCompletionService.update(isCompletionExist.id, updateData);
      } else {
        // create
        const baseData = new CourseCompletion();
        const inputData: CreateCourseCompletionDto = {
          total_progress: totalProgress,
          lecture_progress: lectureProgress,
          quiz_progress: quizProgress,
          quiz_score: quizScore,
          finished: isAllFinished,
          quiz_rank: null,
          overall_rank: null,
          course_id: courseId,
          user_id: userId,
        };
        const createData = Object.assign(baseData, inputData);
        result = await this.courseCompletionService.create(createData);
      }

      Logger.debug('Result Course Completion');
      Logger.debug(result);
      // update course completion
      const course = await this.courseService.findOne({id: courseId});
      if (course) {
        await this.updateTrackCompletion(course.track_id);
      }
      result = convertDate(result);
      return convertResponse(result);
    } catch (error) {
      if (error.statusCode) {
        throw new HttpException(error.message, error.statusCode);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }

  // @Put(':track_id/track_update_completion')
  @ApiImplicitParam({ name: 'track_id', description: 'Example : 049ddb16-9f0f-41a2-90e6-39b8768c8184' })
  async updateTrackCompletion(@Param('track_id') trackId) {
    Logger.debug('=== Track completion');
    try {
      Logger.debug('Update Track Completion');
      const userId = await this.authService.getUserId('learner');
      // get list course contain lecture that have content where track_id = x
      const listCourseWithLecture = await this.courseService.findAllCourseWithLectureWhereParentWithContent({track_id: trackId});
      const listCourseWithLectureHasContent = listCourseWithLecture.filter(item => {
        return item.playlists.filter(item1 => item1.lessons.length > 0).length > 0;
      });
      const numLecture = listCourseWithLectureHasContent.length;
      const numLectureFinished = 0;
      Logger.debug('numLecture : ' + numLecture);

      // get list course contain quiz that have content where track_id = x
      const listCourseWithQuiz = await this.courseService.findAllCourseWithQuizWhereParentWithQuestions({track_id: trackId});
      const listCourseWithQuizHasQuestions = listCourseWithQuiz.filter(item => {
        return item.playlists.filter(item1 => {
          return item1.lessons.filter(item2 => item2.questions.length > 0);
        }).length > 0;
      });
      const numQuiz = listCourseWithQuizHasQuestions.length;
      const numQuizFinished = 0;
      Logger.debug('numQuiz : ' + numQuiz);

      let totalProgress: any = 0;
      let lectureProgress: any = 0;
      let quizProgress: any = 0;
      let quizScore: any = 0;
      let isAllFinished = true;
      // get list course completion (lecture) where track_id = x && user_id = y
      for (const course of listCourseWithLectureHasContent) {
        const courseCompletion = await this.courseCompletionService.findOne({course_id: course.id, user_id: userId});
        if (courseCompletion) {
          totalProgress = Number(totalProgress) + Number(courseCompletion.total_progress);
          lectureProgress = Number(lectureProgress) + Number(courseCompletion.lecture_progress);
          Logger.debug('course : ' + course.title);
          // Logger.debug('courseCompletion : ' + JSON.stringify(courseCompletion));
          Logger.debug('totalProgress : ' + totalProgress);
          Logger.debug('lectureProgress : ' + lectureProgress);
        } else {
          isAllFinished = false;
        }
      }
      // get list course completion (quiz) where track_id = x && user_id = y
      for (const course of listCourseWithQuizHasQuestions) {
        const courseCompletion = await this.courseCompletionService.findOne({course_id: course.id, user_id: userId});
        if (courseCompletion) {
          totalProgress = Number(totalProgress) + Number(courseCompletion.total_progress);
          quizProgress = Number(quizProgress) + Number(courseCompletion.quiz_progress);
          quizScore = Number(quizScore) + Number(courseCompletion.quiz_score);
          Logger.debug('course : ' + course.title);
          // Logger.debug('courseCompletion : ' + JSON.stringify(courseCompletion));
          Logger.debug('totalProgress : ' + totalProgress);
          Logger.debug('quizProgress : ' + quizProgress);
          Logger.debug('quizScore : ' + quizScore);
        } else {
          isAllFinished = false;
        }
      }
      // CALCULATE
      // Lecture Progress
      if (numLecture === 0) {
        lectureProgress = lectureProgress;
      } else {
        lectureProgress = (lectureProgress / numLecture).toFixed(2);
      }
      // Quiz Progress
      if (numQuiz === 0) {
        quizProgress = quizProgress;
      } else {
        quizProgress = (quizProgress / numQuiz).toFixed(2);
      }
      // Quiz Score
      if (numQuizFinished === 0) {
        quizScore = quizScore;
      } else {
        quizScore = (quizScore / numQuizFinished).toFixed(2);
      }
      // Total Progress
      Logger.debug('numLecture + numQuiz : ' + (Number(numLecture) + Number(numQuiz)));
      if (Number(Number(numLecture) + Number(numQuiz)) === Number(0)) {
        totalProgress = totalProgress;
        Logger.debug('total a : ' + totalProgress);
      } else {
        totalProgress = (totalProgress / (Number(numLecture) + Number(numQuiz))).toFixed(2);
        Logger.debug('total b : ' + totalProgress);
      }

      let result;
      const isCompletionExist = await this.trackCompletionService.findOne({track_id: trackId, user_id: userId});
      if (isCompletionExist) {
        // update
        const updateData: TrackCompletion = {
          ...isCompletionExist,
          total_progress: totalProgress,
          lecture_progress: lectureProgress,
          quiz_progress: quizProgress,
          quiz_score: quizScore,
          finished: isAllFinished,
        };
        result = await this.trackCompletionService.update(isCompletionExist.id, updateData);
      } else {
        // create
        const baseData = new TrackCompletion();
        const inputData: CreateTrackCompletionDto = {
          total_progress: totalProgress,
          lecture_progress: lectureProgress,
          quiz_progress: quizProgress,
          quiz_score: quizScore,
          finished: isAllFinished,
          quiz_rank: null,
          overall_rank: null,
          track_id: trackId,
          user_id: userId,
        };
        const createData = Object.assign(baseData, inputData);
        result = await this.trackCompletionService.create(createData);
      }

      Logger.debug('Result Track Completion');
      Logger.debug(result);

      result = convertDate(result);
      return convertResponse(result);
    } catch (error) {
      if (error.statusCode) {
        throw new HttpException(error.message, error.statusCode);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }
}
