import { data as finalExamAnswerData } from '../../src/database/seeders/final_exam_answer/data';

export const mockFinalExamAnswerService = {
    create: () => Promise.resolve(finalExamAnswerData[0]),
    createMultiple: () => Array(Promise.resolve(finalExamAnswerData[0])),
    delete: () => Promise.resolve(finalExamAnswerData[0]),
    findAll: () => Promise.resolve(finalExamAnswerData),
    findAllWithPagination: () => Promise.resolve({data: finalExamAnswerData}),
    findOne: () => Promise.resolve(finalExamAnswerData[0]),
    forceDelete: () => Promise.resolve(finalExamAnswerData[0]),
    update: () => Promise.resolve(finalExamAnswerData[0]),
};
