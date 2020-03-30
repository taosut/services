import { data as courseData } from '../../src/database/seeders/course/data';

export const mockCourseService = {
    changeApproval: () => Promise.resolve(courseData[0]),
    changeOrder: () => Promise.resolve(courseData[0]),
    changePublication: () => Promise.resolve(courseData[0]),
    create: () => Promise.resolve(courseData[0]),
    createMultiple: () => Array(Promise.resolve(courseData[0])),
    delete: () => Promise.resolve(courseData[0]),
    findAll: () => {
      const list = courseData.filter(item => item.deleted_at === null);
      return Promise.resolve(list);
    },
    findAllCourseWithLectureWhereParentWithContent: () => {
      const list = courseData.filter(item => item.deleted_at === null);
      return Promise.resolve(list);
    },
    findAllCourseWithQuizWhereParentWithQuestions: () => {
      const list = courseData.filter(item => item.deleted_at === null);
      return Promise.resolve(list);
    },
    findAllWithPagination: () => {
      const list = courseData.filter(item => item.deleted_at === null);
      return Promise.resolve({data: list});
    },
    findBetween: () => Promise.resolve([courseData[0]]),
    findOne: () => Promise.resolve(courseData[0]),
    findOneWithTrash: (query) => {
      let find;
      for (const prop in query) {
        if (true) { find = courseData.find(item => item[prop] === query[prop]); }
      }
      return Promise.resolve(find);
    },
    forceDelete: () => Promise.resolve(courseData[0]),
    getListByIds: () => Promise.resolve(courseData),
    getOneOrder: () => Promise.resolve([courseData[0]]),
    replaceOrderBetween: () => Promise.resolve(true),
    restore: () => Promise.resolve(courseData[0]),
    update: () => Promise.resolve(courseData[0]),
};
