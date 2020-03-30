import { ILesson } from '../../../models/lesson/lesson.interface';
import { data as playlistData } from '../playlist/data';

export const data: ILesson[] = [
    {
        id: 'a46182b7-3564-4649-bb82-1d0d1263df32', // 1
        title: 'Introduction',
        slug: 'introduction',
        lesson_type: 'lecture',
        description: null,
        duration: 1 * 60 * 60,
        sort_order: 1,

        playlist_id: playlistData[0].id,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
    },
    {
        id: 'c5d50bb5-b9c8-47bd-aa04-750518765f1a', // 2
        title: 'Basic Principles of Algebra',
        slug: 'basic-principles-of-algebra',
        lesson_type: 'lecture',
        description: null,
        duration: 2 * 60 * 60,
        sort_order: 2,

        playlist_id: playlistData[0].id,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
    },
    {
        id: '6a834a5c-34df-4b9e-a872-8fcc2b703865', // 3
        title: 'Integers',
        slug: 'integers',
        lesson_type: 'quiz',
        description: null,
        duration: 1 * 60 * 60,
        sort_order: 3,

        playlist_id: playlistData[0].id,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
    },
    {
        id: '5e84948d-75a9-4bdd-9019-82d75b070bea', // 4
        title: 'Fractions',
        slug: 'fractions',
        description: null,
        lesson_type: 'lecture',
        duration: 4 * 60 * 60,
        sort_order: 4,

        playlist_id: playlistData[0].id,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
    },
  ];
