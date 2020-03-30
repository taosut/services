import { HttpException } from '@nestjs/common';
import { Lambda } from 'aws-sdk';

const lambda: Lambda = new Lambda();
// export function isJSON(str: string): boolean {
//   try {
//     const obj = JSON.parse(str);
//     if (obj && typeof obj === 'object' && obj !== null) {
//       return true;
//     }
//   } catch (err) {
//     return false;
//   }
// }

// tslint:disable-next-line:typedef
export function handleResponse(resultStr: any) {
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

export async function invoker(
  params: Lambda.Types.InvocationRequest
): Promise<string> {
  try {
    const result = await lambda.invoke(params).promise();

    const resPayload: {
      statusCode: number;
      body: string;
      headers: any;
    } = JSON.parse(result.Payload.toString());

    if (resPayload.statusCode === 500) {
      console.error('Error invoking lambda function ' + params.FunctionName);
      console.info('params.Payload', params.Payload);
      console.info('resPayload.body', resPayload.body);
      throw new HttpException(
        resPayload.body && !JSON.parse(resPayload.body)
          ? resPayload.body
          : `${resPayload.statusCode} Error invoking lambda function ` +
            params.FunctionName +
            ' ::: ' +
            JSON.stringify(params.Payload) +
            ' ::: ' +
            resPayload.body,
        resPayload.statusCode
      );
    } else if (resPayload.statusCode >= 400) {
      const parsed = JSON.parse(resPayload.body);
      throw new HttpException(
        {
          statusCode: resPayload.statusCode || resPayload.body,
          message: parsed
            ? parsed.error || parsed.message
            : JSON.stringify(parsed),
        },
        resPayload.statusCode
      );
    }

    return resPayload.body;
  } catch (error) {
    throw new HttpException(error.message, error.statusCode || 500);
  }
}

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
