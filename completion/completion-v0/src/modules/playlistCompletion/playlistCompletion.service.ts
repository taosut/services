import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import _ from 'lodash';
import { Repository } from 'typeorm';
import { AttemptInvokeService } from '../../services/attempt.service';
import { ClassInvokeService } from '../../services/class.service';
import { PlaylistInvokeService } from '../../services/playlist.service';
import { LessonCompletion } from '../lessonCompletion/lessonCompletion.entity';
import { LessonCompletionService } from '../lessonCompletion/lessonCompletion.service';
import { PlaylistCompletion } from './playlistCompletion.entity';
import { PlaylistCompletionDto } from './types/playlistCompletion.types';

@Injectable()
export class PlaylistCompletionService extends TypeOrmCrudService<
  PlaylistCompletion
> {
  constructor(
    @InjectRepository(PlaylistCompletion)
    protected readonly repository: Repository<PlaylistCompletion>,

    @Inject(forwardRef(() => LessonCompletionService))
    protected readonly lessonCompletionService: LessonCompletionService,

    protected readonly playlistInvokeService: PlaylistInvokeService,
    protected readonly classInvokeService: ClassInvokeService,
    protected readonly attemptInvokeService: AttemptInvokeService
  ) {
    super(repository);
  }

  async create(dto: PlaylistCompletionDto): Promise<PlaylistCompletion> {
    const entity = await this.repository.create(dto);
    const response = await this.repository.save(entity);

    return response;
  }

  async update(dto: PlaylistCompletion): Promise<PlaylistCompletion> {
    const entity = await this.repository.create(dto);
    const response = await this.repository.save(entity);

    return response;
  }

  async findLessonCompletions(
    user_id: string,
    playlist_id: string
  ): Promise<LessonCompletion[]> {
    const response = await this.lessonCompletionService.find({
      where: { user_id, playlist_id },
    });

    return response;
  }

  async calculatePlaylistCompletion(
    user_id: string,
    playlist_id: string,
    learning_id: string,
    lessonCompletions: LessonCompletion[],
    playlistCompletions: PlaylistCompletion[],
    playlist: any
  ): Promise<void> {
    // const playlistCompletions = await this.repository.find({
    //   where: {
    //     user_id,
    //     playlist_id,
    //     learning_id,
    //   },
    // });

    // const lessonCompletions = await this.lessonCompletionService.find({
    //   where: { user_id, playlist_id, learning_id },
    // });

    // const learning = await this.classInvokeService.findOne(learning_id);

    // const playlist = await this.playlistInvokeService.findOne(
    //   learning.slug,
    //   playlist_id
    // );

    const progress = await this.calculateProgress(lessonCompletions, playlist);

    const quiz_score = await this.calculateQuizScore(user_id, playlist);

    const quiz_progress = await this.calculateQuizProgress(user_id, playlist);

    const lecture_progress = await this.calculateLectureProgress(
      lessonCompletions,
      playlist
    );

    if (playlistCompletions && playlistCompletions.length) {
      const playlistCompletion = playlistCompletions[0];
      playlistCompletion.progress = progress;
      playlistCompletion.quiz_score = quiz_score;
      playlistCompletion.quiz_progress = quiz_progress;
      playlistCompletion.lecture_progress = lecture_progress;

      await this.update(playlistCompletion);
    } else {
      const playlistDto: PlaylistCompletionDto = {
        elapsed_time: 0,
        progress,
        lecture_progress,
        quiz_progress,
        quiz_score,
        quiz_rank: '0',
        overall_rank: '0',
        playlist_id,
        user_id,
        learning_id,
      };

      await this.create(playlistDto);
    }
  }

  async calculateProgress(
    lessonCompletions: LessonCompletion[],
    playlist: any
  ): Promise<string> {
    const targetProgress = playlist.lessons.length * 100;
    let currentProgress = 0;

    for (const lessonCompletion of lessonCompletions) {
      currentProgress += Number(lessonCompletion.progress);
    }

    const progress = (currentProgress / targetProgress) * 100;

    return progress.toFixed(2).toString();
  }

  async calculateQuizScore(user_id: string, playlist: any): Promise<string> {
    const quizLessons = _.filter(playlist.lessons, lesson => {
      return lesson.type === 'Exam' && lesson.examId;
    });

    let currentScore = 0;
    await Promise.all(
      await quizLessons.map(async lesson => {
        const attempts = await this.attemptInvokeService.findAttemptUser(
          user_id,
          lesson.examId
        );
        if (attempts && attempts.length) {
          currentScore = attempts[0].latest_score;
        }
      })
    );

    const averageScore = currentScore / quizLessons.length;

    return !isNaN(averageScore) ? averageScore.toFixed(2).toString() : '0';
  }

  async calculateQuizProgress(user_id: string, playlist: any): Promise<string> {
    const quizLessons = _.filter(playlist.lessons, lesson => {
      return lesson.type === 'Exam' && lesson.examId;
    });

    let currentProgress = 0;

    await Promise.all(
      await quizLessons.map(async lesson => {
        const attempts = await this.attemptInvokeService.findAttemptUser(
          user_id,
          lesson.examId
        );
        if (attempts && attempts.length && attempts[0].finished) {
          currentProgress += 100;
        }
      })
    );

    const targetProgress = quizLessons.length * 100;

    const progress = (currentProgress / targetProgress) * 100;
    return !isNaN(progress) ? progress.toFixed(2).toString() : '0';
  }
  async calculateLectureProgress(
    lessonCompletions: LessonCompletion[],
    playlist: any
  ): Promise<string> {
    const lectureLessons = _.filter(playlist.lessons, lesson => {
      return lesson.type !== 'Exam';
    });

    let currentProgress = 0;

    for (const lessonCompletion of lessonCompletions) {
      const index = lectureLessons.findIndex(lectureLesson => {
        return lectureLesson.id === lessonCompletion.lesson_id;
      });

      if (index !== -1) {
        currentProgress += Number(lessonCompletion.progress);
      }
    }

    const targetProgress = lectureLessons.length * 100;

    const progress = (currentProgress / targetProgress) * 100;
    return !isNaN(progress) ? progress.toFixed(2).toString() : '0';
  }
}
