import { data as courseUserData } from '../../src/database/seeders/courseuser/data';

export const mockCourseUserService = {
    create: () => Promise.resolve(courseUserData[0]),
    createMultiple: () => Array(Promise.resolve(courseUserData[0])),
    delete: () => Promise.resolve(courseUserData[0]),
    findAll: () => {
      return Promise.resolve(courseUserData[0]);
    },
    findAllWithPagination: () => {
      return Promise.resolve({data: courseUserData[0]});
    },
    findOne: () => Promise.resolve(courseUserData[0]),
    findOneWithTrash: (query) => {
      let find;
      for (const prop in query) {
        if (true) { find = courseUserData.find(item => item[prop] === query[prop]); }
      }
      return Promise.resolve(find);
    },
    forceDelete: () => Promise.resolve(courseUserData[0]),
    restore: () => Promise.resolve(courseUserData[0]),
    update: () => Promise.resolve(courseUserData[0]),
};
