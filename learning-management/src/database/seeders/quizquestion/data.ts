import { IQuizQuestion } from '../../../models/quizquestion/quizquestion.interface';
import { data as quizData } from '../lesson/data';

export const data: IQuizQuestion[] = [
    {
        id: '9e556b81-f868-4b10-968b-1fccb5e3ef28', // 1
        question: 'Which of the following is the indeﬁnite integral of x^2 + 7 ?',

        quiz_id: quizData[2].id,

        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
    },
    {
        id: '4cc69548-326f-428d-ad1d-3c8ac0fd162d', // 2
        question: 'Which of the following is the indeﬁnite integral of x^(1/3) ?  ',

        quiz_id: quizData[2].id,

        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
    },
    {
        id: '4007fa79-4d1f-4bd5-bbf9-f2d576b5b8a7', // 3
        question: 'Which element takes the form of a liquid at normal room temperature?',

        quiz_id: quizData[1].id,

        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
    },
  ];
