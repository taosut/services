import { data as finalExamAttemptData } from '../../src/database/seeders/final_exam_attempt/data';
import { Logger } from '@nestjs/common';

export const mockFinalExamAttemptService = {
    create: () => Promise.resolve(finalExamAttemptData[0]),
    createMultiple: () => Array(Promise.resolve(finalExamAttemptData[0])),
    delete: () => Promise.resolve(finalExamAttemptData[0]),
    findAll: () => {
      return Promise.resolve(finalExamAttemptData);
    },
    findAllWithPagination: () => {
      return Promise.resolve({data: finalExamAttemptData});
    },
    findOne: async (query) => {
      let find;
      if (query.final_exam_id && query.user_id) {
        find = await finalExamAttemptData.find(item => item.final_exam_id === query.id && item.user_id === query.user_id);
      } else {
        find = await finalExamAttemptData.find(item => item.id === query.id);
      }
      return await Promise.resolve(find);
    },
    findOneWithTrash: (query) => {
      let find;
      for (const prop in query) {
        if (true) { find = finalExamAttemptData.find(item => item[prop] === query[prop]); }
      }
      return Promise.resolve(find);
    },
    forceDelete: () => Promise.resolve(finalExamAttemptData[0]),
    restore: () => Promise.resolve(finalExamAttemptData[0]),
    update: () => Promise.resolve(finalExamAttemptData[0]),
};
