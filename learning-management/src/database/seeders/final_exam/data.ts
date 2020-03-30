import { IFinalExam } from '../../../models/final_exam/final_exam.interface';
import { data as trackData } from '../track/data';
import { data as courseData } from '../course/data';
import { data as playlistData } from '../playlist/data';

export const data: IFinalExam[] = [
    {
        id: 'a46182b7-3564-4649-bb82-1d0d1263df32', // 1
        title: 'Exam 01 Mathematics',
        slug: 'exam-01-mathematics',
        description: null,
        duration: 1 * 60 * 60,
        published: false,

        track_id: trackData[0].id,
        course_id: null,
        playlist_id: null,

        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
    },
    {
        id: '45839a3b-2287-4e1f-8e52-71899db9be64', // 1
        title: 'Exam 01 Science',
        slug: 'exam-01-science',
        description: null,
        duration: 2 * 60 * 60,
        published: false,

        track_id: trackData[1].id,
        course_id: null,
        playlist_id: null,

        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
    },
  ];
