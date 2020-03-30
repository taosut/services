import { data as contentData } from '../../src/database/seeders/content/data';

export const mockContentService = {
    create: () => Promise.resolve(contentData[0]),
    createMultiple: () => Array(Promise.resolve(contentData[0])),
    delete: () => Promise.resolve(contentData[0]),
    findAll: () => {
      const list = contentData.filter(item => item.deleted_at === null);
      return Promise.resolve(list);
    },
    findAllWithPagination: () => {
      const list = contentData.filter(item => item.deleted_at === null);
      return Promise.resolve({data: list});
    },
    findOne: () => Promise.resolve(contentData[0]),
    findOneWithTrash: (query) => {
      let find;
      for (const prop in query) {
        if (true) { find = contentData.find(item => item[prop] === query[prop]); }
      }
      return Promise.resolve(find);
    },
    forceDelete: () => Promise.resolve(contentData[0]),
    restore: () => Promise.resolve(contentData[0]),
    update: () => Promise.resolve(contentData[0]),
};
