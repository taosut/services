import { HttpException } from '@nestjs/common';

export const ThrowHttpError = (e: any): never => {
  if (e instanceof HttpException) {
    throw e;
  }

  throw new HttpException(
    e.response
      ? e.response.message || e.response.data || e.response
      : e.message || e.data || 'Internal server error',
    e.response ? e.response.status : e.status || 500,
  );
};
