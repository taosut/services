import { IPlaylist } from '../../../models/playlist/playlist.interface';
import { data as courseData } from '../course/data';

export const data: IPlaylist[] = [
    {
        id: '5303da74-0269-4c1d-8648-46da20ea2e63', // 1
        title: 'Algrebra',
        slug: 'algrebra',
        description: null,
        duration: 1 * 60 * 60,
        sort_order: 1,

        course_id: courseData[0].id,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
    },
    {
        id: '1ca38659-2c40-4857-b74f-ebe10584bb9c', // 2
        title: 'Exponent',
        slug: 'exponent',
        description: null,
        duration: 2 * 60 * 60,
        sort_order: 2,

        course_id: courseData[0].id,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
    },
    {
        id: '6a834a5c-34df-4b9e-a872-8fcc2b703865', // 2
        title: 'Integers',
        slug: 'integers',
        description: null,
        duration: 3 * 60 * 60,
        sort_order: 3,

        course_id: courseData[0].id,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
    },
    {
        id: '5e84948d-75a9-4bdd-9019-82d75b070bea', // 2
        title: 'Fractions',
        slug: 'fractions',
        description: null,
        duration: 4 * 60 * 60,
        sort_order: 4,

        course_id: courseData[0].id,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
    },
  ];
