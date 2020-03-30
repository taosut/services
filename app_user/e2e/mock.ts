import uuid = require('uuid');
import { IUserCreatePayload } from '../src/user/interfaces/userCreatePayload.interface';
import { IUserUpdatePayload } from '../src/user/interfaces/userUpdatePayload.interface';

export const updatedName: string = 'updated_product_name';
export const updatedStatus: string = 'active';
export const userSeed: IUserCreatePayload = {
  id: uuid(),
  username: 'testingZenius777',
  fullName: 'Testing Account Zenius 777',
  password: 'secret',
  email: 'testingZenius777@zenius.com',
};

export const updateSeed: IUserUpdatePayload = {
  fullName: 'Testing Account Zenius 777',
  email: 'testingZenius777@zenius.com',
};
