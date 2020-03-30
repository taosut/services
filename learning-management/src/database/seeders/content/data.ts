import { IContent } from '../../../models/content/content.interface';
import { data as lessonData } from '../lesson/data';

export const data: IContent[] = [
    {
        id: 'a46182b7-3564-4649-bb82-1d0d1263df32', // 1,
        content: 'This is Introduction Content',
        video_source: 'youtube',
        video_link: 'NybHckSEQBI',
        duration: 1 * 60 * 60,

        lesson_id: lessonData[0].id,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
    },
  ];
