import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { ContentInvokeService } from '../../services/invokes/content.service';
import { SubCategory } from './subCategory.entity';

@Injectable()
export class SubCategoryService extends TypeOrmCrudService<SubCategory> {
  constructor(
    @InjectRepository(SubCategory)
    protected readonly repository: Repository<SubCategory>,
    protected readonly contentInvokeService: ContentInvokeService
  ) {
    super(repository);
  }
}
