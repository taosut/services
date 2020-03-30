import { data as lessonData } from '../../src/database/seeders/lesson/data';

export const mockLessonService = {
    changeOrder: () => Promise.resolve(lessonData[0]),
    create: () => Promise.resolve(lessonData[0]),
    createMultiple: () => Array(Promise.resolve(lessonData[0])),
    delete: () => Promise.resolve(lessonData[0]),
    findAll: () => {
      const list = lessonData.filter(item => item.deleted_at === null);
      return Promise.resolve(list);
    },
    findAllLectureWhereParentWithContent: () => {
      const list = lessonData.filter(item => item.deleted_at === null);
      return Promise.resolve(list);
    },
    findAllQuizWhereParentWithQuestions: () => {
      const list = lessonData.filter(item => item.deleted_at === null);
      return Promise.resolve(list);
    },
    findAllWithPagination: () => {
      const list = lessonData.filter(item => item.deleted_at === null);
      return Promise.resolve({data: list});
    },
    findBetween: () => Promise.resolve([lessonData[0]]),
    findOne: (query) => {
      const find = lessonData.find(item => item.id === query.id || item.slug === query.slug);
      return Promise.resolve(find);
    },
    findOneWithTrash: (query) => {
      let find;
      for (const prop in query) {
        if (true) { find = lessonData.find(item => item[prop] === query[prop]); }
      }
      return Promise.resolve(find);
    },
    forceDelete: () => Promise.resolve(lessonData[0]),
    getOneOrder: () => Promise.resolve([lessonData[0]]),
    replaceOrderBetween: () => Promise.resolve(true),
    restore: () => Promise.resolve(lessonData[0]),
    update: () => Promise.resolve(lessonData[0]),
};
