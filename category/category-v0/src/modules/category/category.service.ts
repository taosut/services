import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { ContentInvokeService } from '../../services/invokes/content.service';
import { Category } from './category.entity';

@Injectable()
export class CategoryService extends TypeOrmCrudService<Category> {
  constructor(
    @InjectRepository(Category)
    protected readonly repository: Repository<Category>,
    protected readonly contentInvokeService: ContentInvokeService
  ) {
    super(repository);
  }
}
