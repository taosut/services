import { data as contentAttachmentData } from '../../src/database/seeders/contentattachment/data';

export const mockContentAttachmentService = {
    create: () => Promise.resolve(contentAttachmentData[0]),
    createMultiple: () => Array(Promise.resolve(contentAttachmentData[0])),
    delete: () => Promise.resolve(contentAttachmentData[0]),
    findOne: () => Promise.resolve(contentAttachmentData[0]),
    findOneWithTrash: (query) => {
      let find;
      for (const prop in query) {
        if (true) { find = contentAttachmentData.find(item => item[prop] === query[prop]); }
      }
      return Promise.resolve(find);
    },
    forceDelete: () => Promise.resolve(contentAttachmentData[0]),
};
