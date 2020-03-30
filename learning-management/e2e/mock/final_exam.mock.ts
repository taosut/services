import { data as finalExamData } from '../../src/database/seeders/final_exam/data';
import { data as finalExamQuestionData } from '../../src/database/seeders/final_exam_question/data';
import { Logger } from '@nestjs/common';

export const mockFinalExamService = {
    create: () => Promise.resolve(finalExamData[0]),
    createMultiple: () => Array(Promise.resolve(finalExamData[0])),
    delete: () => Promise.resolve(finalExamData[0]),
    findAll: () => {
      const list = finalExamData.filter(item => item.deleted_at === null);
      return Promise.resolve(list);
    },
    findAllWithPagination: () => {
      const list = finalExamData.filter(item => item.deleted_at === null);
      return Promise.resolve({data: list});
    },
    findOne: async (query) => {
      const find = await finalExamData.find(item => item.id === query.id);
      return await Promise.resolve({
        ...find,
        questions: finalExamQuestionData,
      });
    },
    findOneWithTrash: (query) => {
      let find;
      for (const prop in query) {
        if (true) { find = finalExamData.find(item => item[prop] === query[prop]); }
      }
      return Promise.resolve(find);
    },
    forceDelete: () => Promise.resolve(finalExamData[0]),
    restore: () => Promise.resolve(finalExamData[0]),
    update: () => Promise.resolve(finalExamData[0]),
};
