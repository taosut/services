import { IFinalExamAttemptDetail } from '../../../models/final_exam_attempt_detail/final_exam_attempt_detail.interface';
import { data as finalExamAttemptData } from '../final_exam_attempt/data';
import { data as finalExamQuestionData } from '../final_exam_question/data';
import { demoUserData } from '../../../_handler/auth/demoUserData';

const role = 'learner';
const userData = demoUserData.find(user => user.roles.find(el => el === role) !== undefined);

export const data: IFinalExamAttemptDetail[] = [
    {
        id: 'a46182b7-3564-4649-bb82-1d0d1263df32', // 1
        question: 'Question',
        question_id: finalExamQuestionData[0].id,
        attempt_id: finalExamAttemptData[0].id,
        sort_order: 1,
        choosen_answer_id: null,
        correct_answer_id: null,
        created_at: new Date(),
        updated_at: new Date(),
    },
  ];
