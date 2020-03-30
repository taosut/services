import { HttpException } from '@nestjs/common';
import jwt = require('jsonwebtoken');
import _ from 'lodash';
import { TokenPayload } from '../types/tokenPayload.type';

export const decodeAccessToken = (accessToken: string): TokenPayload => {
  let decryptedToken: TokenPayload;

  try {
    if (accessToken.includes('Bearer')) {
      const splitBearer = accessToken.split(' ');

      if (splitBearer.length > 0) {
        accessToken = splitBearer[splitBearer.length - 1];
      }
    }

    decryptedToken = jwt.decode(accessToken) as TokenPayload;
  } catch (e) {
    throw new HttpException('Invalid jwt format', 400);
  }

  if (!decryptedToken || !decryptedToken.sub || _.isEmpty(decryptedToken)) {
    throw new HttpException('Invalid token payload format', 400);
  }

  return decryptedToken;
};
