import { HttpException } from '@nestjs/common';

export function ThrowKeycloakHttpError(e: any): Error {
  if (e instanceof HttpException) {
    return e;
  }

  return new HttpException(
    e.response
      ? e.response.message || e.response.data || e.response
      : e.message || e.data || 'Internal server error',
    e.response ? e.response.status : e.status || 500
  );
}
