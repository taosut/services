import { HttpException } from '@nestjs/common';

export function isJSON(str: string): boolean {
  try {
    const obj = JSON.parse(str);
    if (obj && typeof obj === 'object' && obj !== null) {
      return true;
    }
  } catch (err) {
    return false;
  }
}

export function handleResponse(resultStr) {
  if (resultStr && isJSON(resultStr)) {
    const result = JSON.parse(resultStr) as {
      statusCode?: number;
      statusText?: string;
      message?: string;
      data?: object;
      error?: object;
    };

    if (result.statusCode) {
      throw new HttpException(
        result.data ||
          result.message ||
          result.statusText ||
          'Error on fetching data',
        result.statusCode || 404
      );
    }
    return result;
  }
}
