import { Injectable } from '@nestjs/common';
import { Lambda } from 'aws-sdk';
import dotenv = require('dotenv');
import { handleResponse, invoker } from '../utils/util';

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env',
});

process.env = { ...parsed, ...process.env };

@Injectable()
export class ClassInvokeService {
  async findByChannel(
    channel_id: string,
    page?: number,
    per_page?: number
  ): Promise<any> {
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.CLASS_SERVICE_NAME,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: `/class`,
        queryStringParameters: {
          filter: `channel_id||eq||${channel_id}`,
          page,
          per_page,
        },
        httpMethod: 'GET',
      }),
    };

    const response = handleResponse(await invoker(params)) || [];

    return response;
  }
}
