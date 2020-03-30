import { ApiModelProperty } from '@nestjs/swagger';
import { Category } from '../category.entity';

export class CategoryDto extends Category {
  @ApiModelProperty()
  classes?: any;
}
