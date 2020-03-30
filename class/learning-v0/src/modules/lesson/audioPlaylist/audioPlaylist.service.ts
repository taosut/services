import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { LessonService } from '../lesson.service';
import { AudioPlaylist } from './audioPlaylist.entity';

@Injectable()
export class AudioPlaylistService extends TypeOrmCrudService<AudioPlaylist> {
  constructor(
    @InjectRepository(AudioPlaylist)
    protected readonly repository: Repository<AudioPlaylist>,
    protected readonly lessonService: LessonService
  ) {
    super(repository);
  }
}
