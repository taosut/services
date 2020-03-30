import { Injectable } from '@nestjs/common';
import { Lambda } from 'aws-sdk';
import { handleResponse, invoker } from './util';

@Injectable()
export class ClassInvokeService {
  async find(query: any, header: any): Promise<any> {
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';
    headers.realm = header.realm;

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.CLASS_SERVICE_NAME,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: `/class`,
        queryStringParameters: query,
        httpMethod: 'GET',
      }),
    };

    return handleResponse(await invoker(params));
  }

  async findOne(id: string, header: any): Promise<any> {
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';
    headers.authorization = header.authorization;
    headers.realm = header.realm;

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.CLASS_SERVICE_NAME,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: `/class/${id}`,
        httpMethod: 'GET',
      }),
    };

    return handleResponse(await invoker(params));
  }

  async update(id: string, data: any): Promise<any> {
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.CLASS_SERVICE_NAME,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: `/class/${id}`,
        httpMethod: 'PUT',
        body: JSON.stringify(data),
      }),
    };

    return handleResponse(await invoker(params));
  }
}
