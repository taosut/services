import { Injectable } from '@nestjs/common';
import { Lambda } from 'aws-sdk';
import dotenv = require('dotenv');
import { handleResponse, invoker } from './util';

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env',
});

process.env = { ...parsed, ...process.env };

@Injectable()
export class AttemptInvokeService {
  async findAttemptUser(userId: string, examId: string): Promise<any> {
    console.info(userId);
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.EXAM_SERVICE_NAME,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: `/attempt`,
        queryStringParameters: {
          // tslint:disable-next-line:object-literal-key-quotes
          filter: `user_id||eq||${userId}`,
          'filter[]': `exam_id||eq||${examId}`,
        },
        httpMethod: 'GET',
      }),
    };

    return handleResponse(await invoker(params));
  }
}
