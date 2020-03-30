import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from './bookmark.entity';

@Injectable()
export class BookmarkService extends TypeOrmCrudService<Bookmark> {
  constructor(
    @InjectRepository(Bookmark)
    protected readonly repository: Repository<Bookmark>
  ) {
    super(repository);
  }
}
