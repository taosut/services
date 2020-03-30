import { data as quizAnswerData } from '../../src/database/seeders/quizanswer/data';

export const mockQuizAnswerService = {
    create: () => Promise.resolve(quizAnswerData[0]),
    createMultiple: () => Array(Promise.resolve(quizAnswerData[0])),
    delete: () => Promise.resolve(quizAnswerData[0]),
    findAll: () => Promise.resolve(quizAnswerData),
    findAllWithPagination: () => Promise.resolve({data: quizAnswerData}),
    findOne: () => Promise.resolve(quizAnswerData[0]),
    forceDelete: () => Promise.resolve(quizAnswerData[0]),
    update: () => Promise.resolve(quizAnswerData[0]),
};
