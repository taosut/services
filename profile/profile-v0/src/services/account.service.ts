import { Injectable } from '@nestjs/common';
import { Lambda } from 'aws-sdk';
import { handleResponse } from '../utils/util';
import AWSInvoker from './invoker.service';
@Injectable()
export class AccountService {
  constructor(private readonly aws: AWSInvoker) {}

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

    return handleResponse(await this.aws.invoker(params));
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

    return handleResponse(await this.aws.invoker(params));
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

    return handleResponse(await this.aws.invoker(params));
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

    return handleResponse(await this.aws.invoker(params));
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

    return handleResponse(await this.aws.invoker(params));
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

    return handleResponse(await this.aws.invoker(params));
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

    return handleResponse(await this.aws.invoker(params));
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

    return handleResponse(await this.aws.invoker(params));
  }

  async purge(dataHeader: any, id: string): Promise<any> {
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
        path: `/accounts/${id}/purge`,
        httpMethod: 'DELETE',
      }),
    };

    return handleResponse(await this.aws.invoker(params));
  }

  async purgeByUsername(dataHeader: any, username: string): Promise<any> {
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
        path: `/accounts/username/${username}/purge`,
        httpMethod: 'DELETE',
      }),
    };

    return handleResponse(await this.aws.invoker(params));
  }
}
