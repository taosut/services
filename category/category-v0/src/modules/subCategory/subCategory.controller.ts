import { Controller } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { SubCategory } from './subCategory.entity';
import { SubCategoryService } from './subCategory.service';

@Crud({
  model: {
    type: SubCategory,
  },
  query: {
    join: {
      category: { eager: true },
    },
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  routes: {
    exclude: [
      'createManyBase',
      'createOneBase',
      'replaceOneBase',
      'updateOneBase',
    ],
  },
})
@ApiUseTags('Sub Category')
@Controller('sub-category')
export class SubCategoryController {
  constructor(public readonly service: SubCategoryService) {}

  get base(): CrudController<SubCategory> {
    return this;
  }
}
