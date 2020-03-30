import { ICourseUser } from '../../../models/courseuser/courseuser.interface';
import { data as courseData } from '../course/data';
import { demoUserData } from '../../../_handler/auth/demoUserData';

const role = 'learner';
const userData = demoUserData.find(user => user.roles.find(el => el === role) !== undefined);

export const data: ICourseUser[] = [
    {
        id: '46581eba-e318-413f-a624-68fa6e70a48e', // 1
        course_id: courseData[0].id,
        user_id: userData.id,
        has_joined: true,
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        id: '641e2193-9d71-45b7-a901-98bad9a5e93d', // 2
        course_id: courseData[1].id,
        user_id: userData.id,
        has_joined: false,
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        id: 'd75955df-a637-4713-8f64-a55ab2cbc1c9', // 3
        course_id: courseData[2].id,
        user_id: userData.id,
        has_joined: false,
        created_at: new Date(),
        updated_at: new Date(),
    },
  ];
