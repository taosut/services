import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { ClassInvokeService } from '../../services/invokes/class.service';
import { ContentInvokeService } from '../../services/invokes/content.service';
import { SubCategory } from './subCategory.entity';
import { SubCategoryDto } from './types/subCategory.dto';

@Injectable()
export class SubCategoryService extends TypeOrmCrudService<SubCategory> {
  constructor(
    @InjectRepository(SubCategory)
    protected readonly repository: Repository<SubCategory>,
    protected readonly contentInvokeService: ContentInvokeService,
    protected readonly classInvokeService: ClassInvokeService
  ) {
    super(repository);
  }

  async getOne(req: CrudRequest): Promise<SubCategory> {
    const response: SubCategoryDto = await super.getOne(req);

    response.classes =
      (await this.classInvokeService.findBySubCategories(response.name)) ||
      null;
    response.image =
      (await this.contentInvokeService.findOne(response.image_id)) || null;

    return response;
  }
}
