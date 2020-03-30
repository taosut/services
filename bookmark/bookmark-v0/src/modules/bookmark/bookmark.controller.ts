import { Controller } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { Bookmark } from './bookmark.entity';
import { BookmarkService } from './bookmark.service';

@Crud({
  model: {
    type: Bookmark,
  },
  query: {},
  params: {
    id: {
      field: 'id',
      type: 'string',
      primary: true,
    },
  },
  routes: { exclude: ['createManyBase'] },
})
@ApiUseTags('Bookmark')
@Controller('bookmark')
export class BookmarkController {
  constructor(public service: BookmarkService) {}
}
