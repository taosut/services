import uuid = require('uuid');
import { ISmsConfigurationCreatePayload } from '../src/smsConfiguration/interfaces/smsConfigurationCreatePayload.interface';

export const updatedStatus: string = 'active';
export const otpConfigSeed: ISmsConfigurationCreatePayload = {
  id: uuid(),
  isActive: true,
  accountSid: 'ACd2b7b1f1126a71e6887ac2f92ed1cb29',
  authToken: '8be647809c83d09f94998ea14cc62ebb',
  sender: '+14086693375',
};
