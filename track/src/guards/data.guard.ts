import { HttpException, HttpStatus } from '@nestjs/common';
import jwt = require('jwt-simple');

import dotenv = require('dotenv');
const { parsed } = dotenv.config({
  path: process.cwd() + '/.env',
});
process.env = { ...parsed, ...process.env };

export function getHeaders(req: any): any {
  if (!req.headers.authorization) { throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED); }
  const authorization = req.headers.authorization.split(' ');
  const token = authorization[1];
  const secret = process.env.KEYCLOAK_SECRET_KEY;

  // decode
  const decoded = jwt.decode(token, secret, true, 'RS256');
  return decoded;
}

export function getUserId(req: any) {
  return 'USER_ID';
  const data = getHeaders(req);

  return data.preferred_username;
}
