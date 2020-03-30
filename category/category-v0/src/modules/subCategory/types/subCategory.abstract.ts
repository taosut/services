import { ApiModelProperty } from '@nestjs/swagger';
import { Category } from '../../category/category.entity';
import { SubCategory } from '../subCategory.entity';

abstract class SubCategoryEntityPayload {
  @ApiModelProperty()
  slug: string;

  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  description: string;

  @ApiModelProperty()
  previewFileId: string;

  @ApiModelProperty()
  category: Category;
}

abstract class SubCategoryCreatePayload {
  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  description: string;

  category: Category;

  @ApiModelProperty()
  categoryId: string;
}

abstract class SubCategoryUpdatePayload {
  @ApiModelProperty()
  id: string;

  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  description: string;

  category: Category;

  @ApiModelProperty()
  categoryId: string;
}

abstract class SubCategoryResponsePayload extends SubCategory {
  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  description: string;

  @ApiModelProperty()
  category: Category;
}

export {
  SubCategoryEntityPayload,
  SubCategoryCreatePayload,
  SubCategoryUpdatePayload,
  SubCategoryResponsePayload,
};
