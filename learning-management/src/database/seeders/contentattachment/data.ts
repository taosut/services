import { IContentAttachment } from '../../../models/contentattachment/contentattachment.interface';
import { data as contentData } from '../content/data';

export const data: IContentAttachment[] = [
    {
        id: 'a46182b7-3564-4649-bb82-1d0d1263df32', // 1,
        name: 'File Name',
        type: 'image/jpg',
        size: 1000,
        path: 'http://url.com',
        content_id: contentData[0].id,

        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
    },
  ];
