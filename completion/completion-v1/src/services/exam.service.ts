import { Injectable } from '@nestjs/common';
import { Lambda } from 'aws-sdk';
import { handleResponse, invoker } from './util';

@Injectable()
export class ExamInvokeService {
  async find(query: any): Promise<any> {
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.EXAM_SERVICE_NAME,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: `/exam`,
        queryStringParameters: query,
        httpMethod: 'GET',
      }),
    };

    return handleResponse(await invoker(params));
  }

  async findByQuery(query: any, header: any): Promise<any> {
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';
    headers.realm = header.realm;

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.EXAM_SERVICE_NAME,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: `/exam/fetch/byMeta`,
        queryStringParameters: query,
        httpMethod: 'GET',
      }),
    };

    return handleResponse(await invoker(params));
  }

  async findOne(id: any): Promise<any> {
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.EXAM_SERVICE_NAME,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: `/exam/${id}`,
        httpMethod: 'GET',
      }),
    };

    return handleResponse(await invoker(params));
  }
}
