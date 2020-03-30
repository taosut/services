import { Injectable } from '@nestjs/common';
import { Lambda } from 'aws-sdk';
import dotenv = require('dotenv');
import { handleResponse, invoker } from '../utils/util';

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env',
});

process.env = { ...parsed, ...process.env };

@Injectable()
export class MembershipsInvokeService {
  async find(user_id: string, class_id: string): Promise<any> {
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.MEMBERSHIP_SERVICE_NAME,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: `/memberships`,
        queryStringParameters: {
          // tslint:disable-next-line:quotemark
          "filter": `user_id||eq||${user_id}`,
          'filter[]': `class_id||eq||${class_id}`,
        },
        httpMethod: 'GET',
      }),
    };

    return handleResponse(await invoker(params));
  }
  async findOne(id: string, query?: any): Promise<any> {
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.MEMBERSHIP_SERVICE_NAME,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: `/memberships/${id}`,
        queryStringParameters: query,
        httpMethod: 'GET',
      }),
    };

    return handleResponse(await invoker(params));
  }
  async deleteAllByClass(classId: string): Promise<any> {
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.MEMBERSHIP_SERVICE_NAME,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: `/memberships/learning/${classId}`, // learning should be class
        httpMethod: 'DELETE',
      }),
    };

    return handleResponse(await invoker(params));
  }
}
