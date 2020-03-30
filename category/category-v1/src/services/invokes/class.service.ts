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
  async findByCategories(categories: string): Promise<any> {
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.CLASS_SERVICE_NAME,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: `/learner/class/fetch/byMeta`,
        queryStringParameters: {
          categories: `${categories}`,
        },
        httpMethod: 'GET',
      }),
    };

    return handleResponse(await invoker(params));
  }
  async findBySubCategories(subCategories: string): Promise<any> {
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.CLASS_SERVICE_NAME,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: '/learner/class/fetch/byMeta',
        queryStringParameters: {
          sub_categories: `${subCategories}`,
        },
        httpMethod: 'get',
      }),
    };

    const invokeResponse = await invoker(params);

    const response = handleResponse(invokeResponse);

    return response;
  }
}
