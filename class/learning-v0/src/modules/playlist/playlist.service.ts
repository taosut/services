import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { LearningService } from '../learning/learning.service';
import { Lesson } from '../lesson/lesson.entity';
import { LessonService } from '../lesson/lesson.service';
import { Playlist } from './playlist.entity';

@Injectable()
export class PlaylistService extends TypeOrmCrudService<Playlist> {
  constructor(
    @InjectRepository(Playlist)
    protected readonly repository: Repository<Playlist>,

    @Inject(forwardRef(() => LessonService))
    protected readonly lessonService: LessonService,

    @Inject(forwardRef(() => LearningService))
    protected readonly learningService: LearningService
  ) {
    super(repository);
  }

  async createOne(req: CrudRequest, dto: Playlist): Promise<Playlist> {
    const playlist = await super.createOne(req, dto);

    const learning = await this.learningService.findOne(playlist.learningId);

    if (learning.indexPlaylists) {
      learning.indexPlaylists.push(playlist.id);
    } else {
      learning.indexPlaylists = [playlist.id];
    }

    await this.learningService.update(learning);

    const response = this.repository.findOne(playlist.id);

    return response;
  }

  async update(dto: Playlist): Promise<Playlist> {
    dto.learning = await this.learningService.findOne(dto.learningId);

    const entity = await this.repository.create(dto);

    const response = await this.repository.save(entity);
    return response;
  }

  async getOne(req: CrudRequest): Promise<Playlist> {
    const playlist = await super.getOne(req);

    if (playlist.indexLessons) {
      const sorterLesson = await this.sortLessons(playlist);

      if (sorterLesson.length) {
        playlist.lessons = sorterLesson;
      }
    }

    return playlist;
  }

  async deleteById(id: string): Promise<DeleteResult> {
    const response = await this.repository.delete(id);

    return response;
  }

  async sortLessons(playlist: Playlist): Promise<Lesson[]> {
    const response = [];

    await Promise.all(
      await playlist.indexLessons.map(async id => {
        const lesson = await this.lessonService.findOne(id);

        if (lesson) {
          await response.push(lesson);
        } else {
          const index = playlist.indexLessons.findIndex(itemId => {
            return itemId === id;
          });

          if (index !== -1) {
            playlist.indexLessons.splice(1, index);
          }

          delete playlist.lessons;
          delete playlist.learning;
          await this.repository.update(playlist.id, playlist);
        }
      })
    );

    return response;
  }
}
