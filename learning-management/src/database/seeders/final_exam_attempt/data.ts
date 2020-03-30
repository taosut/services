import { IFinalExamAttempt } from '../../../models/final_exam_attempt/final_exam_attempt.interface';
import { data as finalExamData } from '../final_exam/data';
import { demoUserData } from '../../../_handler/auth/demoUserData';

const role = 'learner';
const userData = demoUserData.find(user => user.roles.find(el => el === role) !== undefined);

export const data: IFinalExamAttempt[] = [
    {
        id: 'a46182b7-3564-4649-bb82-1d0d1263df32', // 1
        total_attempted: 1,
        total_correct: 1,
        total_question: 2,
        latest_score: '50',
        latest_started_at: new Date(),
        finished: false,
        elapsed_time: 100,
        final_exam_id: finalExamData[0].id,
        user_id: userData.id,
        created_at: new Date(),
        updated_at: new Date(),
    },
  ];
