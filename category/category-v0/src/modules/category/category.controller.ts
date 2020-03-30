import { Controller } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { Category } from './category.entity';
import { CategoryService } from './category.service';

@Crud({
  model: {
    type: Category,
  },
  query: {
    join: {
      subCategories: { eager: true },
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
    exclude: ['createManyBase'],
  },
})
@ApiUseTags('Category')
@Controller('category')
export class CategoryController {
  constructor(public readonly service: CategoryService) {}

  get base(): CrudController<Category> {
    return this;
  }
}
