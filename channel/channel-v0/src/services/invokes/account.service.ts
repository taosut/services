import { Injectable } from '@nestjs/common';
import { Lambda } from 'aws-sdk';
import dotenv = require('dotenv');
import { handleResponse, invoker } from '../utils/util';

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env',
});

process.env = { ...parsed, ...process.env };

@Injectable()
export class AccountInvokeService {
  async find(dataHeader: any, query: any): Promise<any> {
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';
    headers.realm = dataHeader.realm;
    headers.authorization = dataHeader.authorization;

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.ACCOUNT_SERVICE,
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

  async findOne(dataHeader: any, id: string): Promise<any> {
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';
    headers.realm = dataHeader.realm;
    // headers.authorization = dataHeader.authorization;

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.ACCOUNT_SERVICE,
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

  async findOneByUsername(dataHeader: any, username: string): Promise<any> {
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';
    headers.realm = dataHeader.realm;
    headers.authorization = dataHeader.authorization;

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.ACCOUNT_SERVICE,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: `/accounts/find`,
        queryStringParameters: {
          username,
        },
        httpMethod: 'GET',
      }),
    };

    return handleResponse(await invoker(params));
  }

  async findOneByEmail(dataHeader: any, email: string): Promise<any> {
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';
    headers.realm = dataHeader.realm;
    headers.authorization = dataHeader.authorization;

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.ACCOUNT_SERVICE,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: `/accounts/find`,
        queryStringParameters: {
          email,
        },
        httpMethod: 'GET',
      }),
    };

    return handleResponse(await invoker(params));
  }

  async create(dataHeader: any, data: any): Promise<any> {
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';
    headers.realm = dataHeader.realm;
    headers.authorization = dataHeader.authorization;

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.ACCOUNT_SERVICE,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: `/accounts`,
        httpMethod: 'POST',
        body: JSON.stringify(data),
      }),
    };

    return handleResponse(await invoker(params));
  }

  async update(dataHeader: any, id: string, data: any): Promise<any> {
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';
    headers.realm = dataHeader.realm;
    headers.authorization = dataHeader.authorization;

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.ACCOUNT_SERVICE,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: `/accounts/${id}`,
        httpMethod: 'PATCH',
        body: JSON.stringify(data),
      }),
    };

    return handleResponse(await invoker(params));
  }

  async delete(dataHeader: any, id: string): Promise<any> {
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';
    headers.realm = dataHeader.realm;
    headers.authorization = dataHeader.authorization;

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.ACCOUNT_SERVICE,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: `/accounts/${id}`,
        httpMethod: 'DELETE',
      }),
    };

    return handleResponse(await invoker(params));
  }

  async deleteByUsername(dataHeader: any, username: string): Promise<any> {
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';
    headers.realm = dataHeader.realm;
    headers.authorization = dataHeader.authorization;

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.ACCOUNT_SERVICE,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: `/accounts/username/${username}`,
        httpMethod: 'DELETE',
      }),
    };

    return handleResponse(await invoker(params));
  }
}
