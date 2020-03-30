import { ApiModelProperty } from '@nestjs/swagger';
import { SubCategory } from '../subCategory.entity';

export class SubCategoryDto extends SubCategory {
  @ApiModelProperty()
  classes?: any;

  @ApiModelProperty()
  image?: any;
}
