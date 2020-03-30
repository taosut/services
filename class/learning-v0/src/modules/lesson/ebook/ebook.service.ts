import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { LessonService } from '../lesson.service';
import { Ebook } from './ebook.entity';

@Injectable()
export class EbookService extends TypeOrmCrudService<Ebook> {
  constructor(
    @InjectRepository(Ebook)
    protected readonly repository: Repository<Ebook>,
    protected readonly lessonService: LessonService
  ) {
    super(repository);
  }
}
