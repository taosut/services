import { data as finalExamQuestionData } from '../../src/database/seeders/final_exam_question/data';

export const mockFinalExamQuestionService = {
    create: () => Promise.resolve(finalExamQuestionData[0]),
    createMultiple: () => Array(Promise.resolve(finalExamQuestionData[0])),
    delete: () => Promise.resolve(finalExamQuestionData[0]),
    findAll: () => {
      const list = finalExamQuestionData.filter(item => item.deleted_at === null);
      return Promise.resolve(list);
    },
    findAllWithPagination: () => {
      const list = finalExamQuestionData.filter(item => item.deleted_at === null);
      return Promise.resolve({data: list});
    },
    findOne: (query) => {
      const find = finalExamQuestionData.find(item => item.id === query.id);
      return Promise.resolve(find);
    },
    findOneWithTrash: (query) => {
      let find;
      for (const prop in query) {
        if (true) { find = finalExamQuestionData.find(item => item[prop] === query[prop]); }
      }
      return Promise.resolve(find);
    },
    forceDelete: () => Promise.resolve(finalExamQuestionData[0]),
    restore: () => Promise.resolve(finalExamQuestionData[0]),
    update: () => Promise.resolve(finalExamQuestionData[0]),
};
