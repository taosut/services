import { Injectable } from '@nestjs/common';
import { Lambda } from 'aws-sdk';
import dotenv = require('dotenv');
import { handleResponse, invoker } from '../utils/util';

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env',
});

process.env = { ...parsed, ...process.env };

@Injectable()
export class ContentInvokeService {
  async findOne(id: string): Promise<any> {
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.CONTENT_SERVICE_NAME,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: `/content/${id}`,
        httpMethod: 'GET',
      }),
    };

    try {
      return handleResponse(await invoker(params));
    } catch (error) {
      return null;
    }
  }
}
