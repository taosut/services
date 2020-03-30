import jwt = require('jsonwebtoken');

export function getUserId(authorization: string): any {
  try {
    const exp = authorization.split(' ');
    const access_token = exp[1];

    const decoded = jwt.decode(access_token);
    return decoded.sub;
  } catch (err) {
    return null;
  }
}
