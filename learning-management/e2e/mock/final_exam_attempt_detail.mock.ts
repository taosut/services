import { data as finalExamAttemptDetailData } from '../../src/database/seeders/final_exam_attempt_detail/data';
import { Logger } from '@nestjs/common';

export const mockFinalExamAttemptDetailService = {
    create: () => Promise.resolve(finalExamAttemptDetailData[0]),
    createMultiple: () => Array(Promise.resolve(finalExamAttemptDetailData[0])),
    delete: () => Promise.resolve(finalExamAttemptDetailData[0]),
    findAll: () => {
      return Promise.resolve(finalExamAttemptDetailData);
    },
    findAllWithPagination: () => {
      return Promise.resolve({data: finalExamAttemptDetailData});
    },
    findOne: async (query) => {
      if (query.from) {
        Logger.debug(query.from);
        Logger.debug('query ' + JSON.stringify(query));
      }
      const find = await finalExamAttemptDetailData.find(item => item.id === query.id);
      if (query.from) {
        Logger.debug('find ' + JSON.stringify(find));
      }
      return await Promise.resolve(find);
    },
    findOneWithTrash: (query) => {
      let find;
      for (const prop in query) {
        if (true) { find = finalExamAttemptDetailData.find(item => item[prop] === query[prop]); }
      }
      return Promise.resolve(find);
    },
    forceDelete: () => Promise.resolve(finalExamAttemptDetailData[0]),
    restore: () => Promise.resolve(finalExamAttemptDetailData[0]),
    update: () => Promise.resolve(finalExamAttemptDetailData[0]),
};
