import { Injectable } from '@nestjs/common';
import { Lambda } from 'aws-sdk';
import { handleResponse, invoker } from './util';

@Injectable()
export class AccountInvokeService {
  async find(query: any, header: any): Promise<any> {
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';
    headers.realm = header.realm;

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.ACCOUNT_SERVICE_NAME,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: `/accounts`,
        queryStringParameters: query,
        httpMethod: 'GET',
      }),
    };

    return handleResponse(await invoker(params));
  }

  async findOne(id: any, header: any): Promise<any> {
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';
    headers.realm = header.realm;

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.ACCOUNT_SERVICE_NAME,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: `/accounts/${id}`,
        httpMethod: 'GET',
      }),
    };

    return handleResponse(await invoker(params));
  }
}
