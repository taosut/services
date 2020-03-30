import { HttpException } from '@nestjs/common';
import { Context } from 'aws-lambda';
import axios from 'axios';
import _ from 'lodash';
import urlJoin from 'url-join';
import { decodeAccessToken } from '../utils/decodeAccessToken';
import { generatePolicy } from '../utils/generatePolicy.util';

export const authorizerBase = (
  event: any,
  _context: Context,
  callback: any,
  role?: string
): any => {
  const authorization =
    event.headers.Authorization || event.headers.authorization;
  const realm = (event.headers.Realm || event.headers.realm).toLowerCase();

  if (!(authorization && realm)) {
    console.error('Authorizer error: No Authorization or Realm in headers');
    return callback(new HttpException('Unauthorized', 401));
  }

  const tokenParts = authorization.split(' ');

  const tokenValue = tokenParts[1];

  if (!(tokenParts[0].toLowerCase() === 'bearer' && tokenValue)) {
    // no auth token!
    console.error('Invalid token type, no bearer');
    return callback(new HttpException('Unauthorized', 401));
  }

  try {
    const decoded = decodeAccessToken(tokenValue);

    const authUrl = baseUrl(realm);

    const url = `${authUrl}/realms/${realm}/protocol/openid-connect/userinfo`;

    return axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + tokenValue,
        },
      })
      .then(() => {
        if (role && !decoded.realm_access.roles.includes(role)) {
          console.error(
            `Forbidden access by: ${
              decoded.sub
            }, should have ${role} level access, current roles ${decoded.realm_access.roles.toString()}`
          );
          return callback(new HttpException('Unauthorized', 401));
        }

        return callback(
          null,
          generatePolicy(decoded.sub, 'Allow', event.methodArn)
        );
      })
      .catch(err => {
        return callback(new HttpException('Unauthorized', 401));
      });
  } catch (err) {
    console.error('Authorizer error', err);

    return callback(new HttpException('Unauthorized', 401));
  }
};

function baseUrl(realm: string): string {
  if (realm === 'agora') {
    return urlJoin(`${process.env.AGORA_KEYCLOAK_BASE_URL}`, 'auth');
  } else {
    return urlJoin(`${process.env.AGORA_KEYCLOAK_BASE_URL_SAAS}`, 'auth');
  }
}
