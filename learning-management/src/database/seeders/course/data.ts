import { ICourse } from '../../../models/course/course.interface';
import { data as trackData } from '../track/data';
import { demoUserData } from '../../../_handler/auth/demoUserData';

const role = 'author';
const userData = demoUserData.find(user => user.roles.find(el => el === role) !== undefined);

export const data: ICourse[] = [
    {
        id: '46581eba-e318-413f-a624-68fa6e70a48e', // 1
        title: 'Basic Mathematics',
        slug: 'basic-mathematics',
        preview: null,
        description: null,
        term_and_condition: null,
        published: false,
        approved: false,
        sort_order: 1,

        user_id: userData.id,
        track_id: trackData[0].id,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
    },
    {
        id: '641e2193-9d71-45b7-a901-98bad9a5e93d', // 2
        title: 'Mathematics for Beginner',
        slug: 'mathematics-for-beginner',
        preview: null,
        description: null,
        term_and_condition: null,
        published: false,
        approved: false,
        sort_order: 2,

        user_id: userData.id,
        track_id: trackData[0].id,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
    },
    {
        id: 'd75955df-a637-4713-8f64-a55ab2cbc1c9', // 3
        title: 'Mathematics For Intermediate',
        slug: 'mathematics-for-intermediate',
        preview: null,
        description: null,
        term_and_condition: null,
        published: false,
        approved: false,
        sort_order: 3,

        user_id: userData.id,
        track_id: trackData[0].id,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
    },
    {
        id: 'a8fbf9ba-a9ee-42cb-8a7e-4067e895db87', // 4
        title: 'Science For Beginner',
        slug: 'science-for-beginner',
        preview: null,
        description: null,
        term_and_condition: null,
        published: false,
        approved: false,
        sort_order: 1,

        user_id: userData.id,
        track_id: trackData[1].id,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
    },
    {
        id: '74b97a52-5a00-4557-ba50-35795120f060', // 5
        title: 'Science For Intermediate',
        slug: 'science-for-intermediate',
        preview: null,
        description: null,
        term_and_condition: null,
        published: false,
        approved: false,
        sort_order: 2,

        user_id: userData.id,
        track_id: trackData[1].id,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
    },
    {
        id: '71ba719b-f4b5-4808-8514-e8c049357557', // 6
        title: 'Technology Introduction',
        slug: 'technology-introduction',
        preview: null,
        description: null,
        term_and_condition: null,
        published: false,
        approved: false,
        sort_order: 1,

        user_id: userData.id,
        track_id: trackData[2].id,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
    },
    {
        id: 'f1450cd1-dd39-42ef-8093-00007cc6962f', // 7
        title: 'Learning Business from Expert',
        slug: 'learning-business-from-expert',
        preview: null,
        description: null,
        term_and_condition: null,
        published: false,
        approved: false,
        sort_order: 1,

        user_id: userData.id,
        track_id: trackData[5].id,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
    },
  ];
