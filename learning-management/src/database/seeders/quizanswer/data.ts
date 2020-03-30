import { IQuizAnswer } from '../../../models/quizanswer/quizanswer.interface';
import { data as questionData } from '../quizquestion/data';

export const data: IQuizAnswer[] = [
    {
        id: '9e556b81-f868-4b10-968b-1fccb5e3ef28', // 1
        answer: 'Choice A',
        correct: true,

        question_id: questionData[0].id,

        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        id: '4cc69548-326f-428d-ad1d-3c8ac0fd162d', // 2
        answer: 'Choice B',
        correct: false,

        question_id: questionData[0].id,

        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        id: '4007fa79-4d1f-4bd5-bbf9-f2d576b5b8a7', // 3
        answer: 'Choice C',
        correct: false,

        question_id: questionData[0].id,

        created_at: new Date(),
        updated_at: new Date(),
    },
  ];
