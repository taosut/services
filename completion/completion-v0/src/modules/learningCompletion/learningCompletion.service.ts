import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import _ from 'lodash';
import { Repository } from 'typeorm';
import { AttemptInvokeService } from '../../services/attempt.service';
import { ClassInvokeService } from '../../services/class.service';
import { PlaylistInvokeService } from '../../services/playlist.service';
import { LessonCompletionService } from '../lessonCompletion/lessonCompletion.service';
import { PlaylistCompletionService } from '../playlistCompletion/playlistCompletion.service';
import { LearningCompletion } from './learningCompletion.entity';
import { LearningCompletionDto } from './types/learningCompletion.types';

@Injectable()
export class LearningCompletionService extends TypeOrmCrudService<
  LearningCompletion
> {
  constructor(
    @InjectRepository(LearningCompletion)
    protected readonly repository: Repository<LearningCompletion>,

    @Inject(forwardRef(() => PlaylistCompletionService))
    protected readonly playlistCompletionService: PlaylistCompletionService,

    @Inject(forwardRef(() => LessonCompletionService))
    protected readonly lessonCompletionService: LessonCompletionService,

    protected readonly classInvokeService: ClassInvokeService,
    protected readonly playlistInvokeService: PlaylistInvokeService,
    protected readonly attemptInvokeService: AttemptInvokeService
  ) {
    super(repository);
  }

  async create(dto: LearningCompletionDto): Promise<LearningCompletion> {
    const entity = await this.repository.create(dto);
    const response = await this.repository.save(entity);

    return response;
  }

  async update(dto: LearningCompletion): Promise<LearningCompletion> {
    const entity = await this.repository.create(dto);
    const response = await this.repository.save(entity);

    return response;
  }

  async calculateLearningCompletion(
    user_id: string,
    learning_id: string
  ): Promise<void> {
    const learningCompletions = await this.repository.find({
      where: { user_id, learning_id },
    });

    if (learningCompletions && learningCompletions.length) {
      const learningCompletion = learningCompletions[0];

      learningCompletion.progress = await this.calculateProgress(
        learningCompletion.user_id,
        learningCompletion.learning_id
      );

      learningCompletion.lecture_progress = await this.calculateLectureProgress(
        learningCompletion.user_id,
        learningCompletion.learning_id
      );

      learningCompletion.quiz_progress = await this.calculateQuizProgress(
        learningCompletion.user_id,
        learningCompletion.learning_id
      );

      learningCompletion.quiz_score = await this.calculateQuizScore(
        learningCompletion.user_id,
        learningCompletion.learning_id
      );

      await this.update(learningCompletion);
    } else {
      const progress = await this.calculateProgress(user_id, learning_id);

      const lecture_progress = await this.calculateLectureProgress(
        user_id,
        learning_id
      );

      const quiz_progress = await this.calculateQuizProgress(
        user_id,
        learning_id
      );

      const quiz_score = await this.calculateQuizScore(user_id, learning_id);

      const learningDto: LearningCompletionDto = {
        elapsed_time: 0,
        progress,
        lecture_progress,
        quiz_progress,
        quiz_score,
        quiz_rank: '0',
        overall_rank: '0',
        learning_id,
        user_id,
      };
      await this.create(learningDto);
    }
  }

  async calculateProgress(
    user_id: string,
    learning_id: string
  ): Promise<string> {
    const playlistCompletions = await this.playlistCompletionService.find({
      where: { user_id, learning_id },
    });

    const learning = await this.classInvokeService.findOne(learning_id);

    const targetProgress = learning.playlists.length * 100;

    let currentProgress = 0;

    for (const playlistCompletion of playlistCompletions) {
      currentProgress += Number(playlistCompletion.progress);
    }

    const progress = (currentProgress / targetProgress) * 100;

    return progress.toFixed(2).toString();
  }

  async calculateLectureProgress(
    user_id: string,
    learning_id: string
  ): Promise<string> {
    const lessonCompletions = await this.lessonCompletionService.find({
      where: { user_id, learning_id },
    });

    const learning = await this.classInvokeService.findOne(learning_id);

    const lectureLessons = [];
    await Promise.all(
      await learning.playlists.map(async playlist => {
        const lecturePlaylist = await this.playlistInvokeService.findOne(
          learning.slug,
          playlist.id
        );

        for (const lesson of lecturePlaylist.lessons) {
          if (lesson.type !== 'Exam') {
            lectureLessons.push(lesson);
          }
        }
      })
    );

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
  async calculateQuizProgress(
    user_id: string,
    learning_id: string
  ): Promise<string> {
    const learning = await this.classInvokeService.findOne(learning_id);

    const quizLessons = [];
    await Promise.all(
      await learning.playlists.map(async playlist => {
        const quizPlaylist = await this.playlistInvokeService.findOne(
          learning.slug,
          playlist.id
        );

        for (const lesson of quizPlaylist.lessons) {
          if (lesson.type === 'Exam' && lesson.examId) {
            quizLessons.push(lesson);
          }
        }
      })
    );

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
  async calculateQuizScore(
    user_id: string,
    learning_id: string
  ): Promise<string> {
    const learning = await this.classInvokeService.findOne(learning_id);

    const quizLessons = [];
    await Promise.all(
      await learning.playlists.map(async playlist => {
        const quizPlaylist = await this.playlistInvokeService.findOne(
          learning.slug,
          playlist.id
        );

        for (const lesson of quizPlaylist.lessons) {
          if (lesson.type === 'Exam' && lesson.examId) {
            quizLessons.push(lesson);
          }
        }
      })
    );

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
}
