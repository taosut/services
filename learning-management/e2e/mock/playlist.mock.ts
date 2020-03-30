import { data as playlistData } from '../../src/database/seeders/playlist/data';

export const mockPlaylistService = {
    changeOrder: () => Promise.resolve(playlistData[0]),
    create: () => Promise.resolve(playlistData[0]),
    createMultiple: () => Array(Promise.resolve(playlistData[0])),
    delete: () => Promise.resolve(playlistData[0]),
    findAll: () => {
      const list = playlistData.filter(item => item.deleted_at === null);
      return Promise.resolve(list);
    },
    findAllPlaylistWithLectureWhereParentWithContent: () => {
      const list = playlistData.filter(item => item.deleted_at === null);
      return Promise.resolve(list);
    },
    findAllPlaylistWithQuizWhereParentWithQuestions: () => {
      const list = playlistData.filter(item => item.deleted_at === null);
      return Promise.resolve(list);
    },
    findAllWithPagination: () => {
      const list = playlistData.filter(item => item.deleted_at === null);
      return Promise.resolve({data: list});
    },
    findBetween: () => Promise.resolve([playlistData[0]]),
    findOne: () => Promise.resolve(playlistData[0]),
    findOneWithTrash: (query) => {
      let find;
      for (const prop in query) {
        if (true) { find = playlistData.find(item => item[prop] === query[prop]); }
      }
      return Promise.resolve(find);
    },
    forceDelete: () => Promise.resolve(playlistData[0]),
    getOneOrder: () => Promise.resolve([playlistData[0]]),
    replaceOrderBetween: () => Promise.resolve(true),
    restore: () => Promise.resolve(playlistData[0]),
    update: () => Promise.resolve(playlistData[0]),
};
