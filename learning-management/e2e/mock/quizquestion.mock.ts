import { data as quizQuestionData } from '../../src/database/seeders/quizquestion/data';

export const mockQuizQuestionService = {
    create: () => Promise.resolve(quizQuestionData[0]),
    createMultiple: () => Array(Promise.resolve(quizQuestionData[0])),
    delete: () => Promise.resolve(quizQuestionData[0]),
    findAll: () => {
        const list = quizQuestionData.filter(item => item.deleted_at === null);
        return Promise.resolve(list);
    },
    findAllWithPagination: () => {
      const list = quizQuestionData.filter(item => item.deleted_at === null);
      return Promise.resolve({data: list});
    },
    findOne: () => Promise.resolve(quizQuestionData[0]),
    findOneWithTrash: (query) => {
      let find;
      for (const prop in query) {
        if (true) { find = quizQuestionData.find(item => item[prop] === query[prop]); }
      }
      return Promise.resolve(find);
    },
    forceDelete: () => Promise.resolve(quizQuestionData[0]),
    restore: () => Promise.resolve(quizQuestionData[0]),
    update: () => Promise.resolve(quizQuestionData[0]),
};
