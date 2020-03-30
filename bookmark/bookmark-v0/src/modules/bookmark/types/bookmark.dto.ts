import { Injectable } from '@nestjs/common';

@Injectable()
export class BookmarkDto {
  user_id: string;
  class_id: string;
  track_id: string;
  unit_id: string;
  ebook_id: string;
}
