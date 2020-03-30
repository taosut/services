import { data as trackData } from '../../src/database/seeders/track/data';

export const mockTrackService = {
    addTrackOnCourse: () => Promise.resolve(trackData[0]),
    changeOrder: () => Promise.resolve(trackData[0]),
    create: () => Promise.resolve(trackData[0]),
    createMultiple: () => Array(Promise.resolve(trackData[0])),
    delete: () => Promise.resolve(trackData[0]),
    findAll: () => {
      const list = trackData.filter(item => item.deleted_at === null);
      return Promise.resolve(list);
    },
    findAllWithPagination: () => {
      const list = trackData.filter(item => item.deleted_at === null);
      return Promise.resolve({data: list});
    },
    findBetween: () => Promise.resolve([trackData[0]]),
    findOne: () => Promise.resolve(trackData[0]),
    findOneWithTrash: (query) => {
      let find;
      for (const prop in query) {
        if (true) { find = trackData.find(item => item[prop] === query[prop]); }
      }
      return Promise.resolve(find);
    },
    forceDelete: () => Promise.resolve(trackData[0]),
    getCount: () => Promise.resolve(5),
    getListByIds: () => Promise.resolve(trackData),
    getOneOrder: () => Promise.resolve([trackData[0]]),
    removeTrackOnCourse: () => Promise.resolve(trackData[0]),
    replaceOrderBetween: () => Promise.resolve(true),
    restore: () => Promise.resolve(trackData[0]),
    update: () => Promise.resolve(trackData[0]),
};
