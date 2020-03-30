import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import _ from 'lodash';
import { Repository } from 'typeorm';
import { ClassInvokeService } from '../../services/class.service';
import { LessonInvokeService } from '../../services/lesson.service';
import { PlaylistInvokeService } from '../../services/playlist.service';
import { LearningCompletionService } from '../learningCompletion/learningCompletion.service';
// import { PlaylistCompletion } from '../playlistCompletion/playlistCompletion.entity';
import { PlaylistCompletionService } from '../playlistCompletion/playlistCompletion.service';
import { LessonCompletion } from './lessonCompletion.entity';
import {
  NextCompletionDto,
  NextCompletionResponse,
} from './types/nextCompletion';

@Injectable()
export class LessonCompletionService extends TypeOrmCrudService<
  LessonCompletion
> {
  constructor(
    @InjectRepository(LessonCompletion)
    protected readonly repository: Repository<LessonCompletion>,

    @Inject(forwardRef(() => PlaylistCompletionService))
    protected readonly playlistCompletionService: PlaylistCompletionService,
    @Inject(forwardRef(() => LearningCompletionService))
    protected readonly learningCompletionService: LearningCompletionService,

    protected readonly classInvokeService: ClassInvokeService,
    protected readonly playlistInvokeService: PlaylistInvokeService,
    protected readonly lessonInvokeService: LessonInvokeService
  ) {
    super(repository);
  }

  async createOneAutomatic(dto: LessonCompletion): Promise<LessonCompletion> {
    dto = await this.validateDto(dto);

    const entity = await this.repository.create(dto);
    const response = await this.repository.save(entity);

    await this.calculateCompletions(response);

    return response;
  }

  async updateOneAutomatic(
    id: string,
    dto: LessonCompletion
  ): Promise<LessonCompletion> {
    const entry = await this.repository.findOne(id);

    entry.progress = dto.progress;

    const entity = await this.repository.create(entry);
    const response = await this.repository.save(entity);

    await this.calculateCompletions(response);

    return response;
  }

  async replaceOneAutomatic(
    id: string,
    dto: LessonCompletion
  ): Promise<LessonCompletion> {
    const entry = await this.repository.findOne(id);

    entry.progress = dto.progress;

    const entity = await this.repository.create(entry);
    const response = await this.repository.save(entity);

    await this.calculateCompletions(response);

    return response;
  }

  async validateDto(dto: LessonCompletion): Promise<LessonCompletion> {
    if (dto.learning_id && dto.playlist_id && dto.lesson_id) {
      const learning: any = await this.classInvokeService.findOne(
        dto.learning_id
      );

      const playlist: any = await this.playlistInvokeService.findOne(
        learning.slug,
        dto.playlist_id
      );
      await this.lessonInvokeService.findOne(playlist.slug, dto.lesson_id);
    }

    const lessonCompletions = await this.repo.find({
      where: { user_id: dto.user_id },
    });

    if (lessonCompletions) {
      for (const lessonCompletion of lessonCompletions) {
        if (lessonCompletion.lesson_id === dto.lesson_id) {
          dto.id = lessonCompletion.id;
          break;
        }
      }
    }

    return dto;
  }

  async calculateCompletions(lesson: LessonCompletion): Promise<void> {
    const user_id = lesson.user_id;
    const playlist_id = lesson.playlist_id;
    const learning_id = lesson.learning_id;

    const lessonCompletions = await this.repository.find({
      where: { user_id, learning_id },
    });

    const playlistCompletions = await this.playlistCompletionService.find({
      where: { user_id, learning_id, playlist_id },
    });

    const learningCompletions = await this.learningCompletionService.find({
      where: { user_id, learning_id },
    });

    const learning = await this.classInvokeService.findOne(learning_id);

    const playlist = await this.playlistInvokeService.findOne(
      learning.slug,
      playlist_id
    );

    await this.playlistCompletionService.calculatePlaylistCompletion(
      lesson.user_id,
      lesson.playlist_id,
      lesson.learning_id,
      lessonCompletions,
      playlistCompletions,
      playlist
    );

    await this.learningCompletionService.calculateLearningCompletion(
      lesson.user_id,
      lesson.learning_id,
      learningCompletions,
      playlistCompletions,
      lessonCompletions,
      learning
    );
  }

  async nextCompletion(
    dto: NextCompletionDto
  ): Promise<NextCompletionResponse> {
    if (!dto.learning_id || !dto.user_id) {
      throw new HttpException(
        'learning_id and user_id are required',
        HttpStatus.BAD_REQUEST
      );
    }

    // Find next playlist
    const learning = await this.classInvokeService.findOne(dto.learning_id);

    learning.playlists = _.sortBy(learning.playlists, [
      o => {
        return o.title;
      },
    ]);

    let targetPlaylist = null;

    for (const playlist of learning.playlists) {
      const hasPlaylistCompletion = await this.playlistCompletionService.findOne(
        {
          where: {
            user_id: dto.user_id,
            playlist_id: playlist.id,
            learning_id: learning.id,
          },
        }
      );

      const playlistHasLesson = await this.playlistInvokeService.findOne(
        learning.slug,
        playlist.id
      );

      const condition =
        !hasPlaylistCompletion || !hasPlaylistCompletion.finished;

      if (
        condition &&
        playlistHasLesson.lessons &&
        playlistHasLesson.lessons.length
      ) {
        targetPlaylist = playlistHasLesson;
        break;
      }
    }

    if (!targetPlaylist) {
      targetPlaylist = learning.playlists.reverse()[0];

      targetPlaylist = await this.playlistInvokeService.findOne(
        learning.slug,
        targetPlaylist.id
      );
    }

    // Find next lesson
    targetPlaylist.lessons = _.sortBy(targetPlaylist.lessons, [
      o => {
        return o.title;
      },
    ]);

    let targetLesson = null;

    for (const lesson of targetPlaylist.lessons) {
      const hasLessonCompletion = await this.repository.findOne({
        where: {
          user_id: dto.user_id,
          lesson_id: lesson.id,
          playlist_id: targetPlaylist.id,
          learning_id: learning.id,
        },
      });

      const condition = !hasLessonCompletion || !hasLessonCompletion.finished;

      if (condition) {
        targetLesson = lesson;
        break;
      }
    }

    if (!targetLesson) {
      const learningCompletion = await this.learningCompletionService.findOne({
        where: { user_id: dto.user_id, learning_id: dto.learning_id },
      });
      throw new HttpException(
        {
          message: 'User has completed this learning',
          learningCompletion,
          targetPlaylist: null,
          lesson: null,
        },
        HttpStatus.CREATED
      );
    }

    const response: NextCompletionResponse = {
      targetPlaylist,
      lesson: targetLesson,
    };

    return response;
  }
}
