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
  async find(query: any, header: any): Promise<any> {
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';
    headers.authorization = header.authorization;
    headers.realm = header.realm;

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.CONTENT_SERVICE_NAME,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: `/content`,
        queryStringParameters: query,
        httpMethod: 'GET',
      }),
    };

    try {
      return handleResponse(await invoker(params));
    } catch (error) {
      return undefined;
    }
  }

  async findOne(id: string, query: any, header: any): Promise<any> {
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';
    headers.authorization = header.authorization;
    headers.realm = header.realm;

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.CONTENT_SERVICE_NAME,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: `/content/${id}`,
        queryStringParameters: query,
        httpMethod: 'GET',
      }),
    };

    try {
      return handleResponse(await invoker(params));
    } catch (error) {
      return undefined;
    }
  }
}
