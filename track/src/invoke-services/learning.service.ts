import { Injectable } from '@nestjs/common';
import { handleResponse } from './util';
import AWSInvoker from './invoker.service';
import dotenv = require('dotenv');
import _ = require('lodash');
import { Lambda } from 'aws-sdk';

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env',
});

process.env = { ...parsed, ...process.env };

@Injectable()
export class LearningInvokeService {
  private aws;
  constructor() {
    this.aws = new AWSInvoker();
  }
  async find(query: any): Promise<any> {
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.LEARNING_SERVICE_NAME,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: `/learning`,
        queryStringParameters: query,
        httpMethod: 'GET',
      }),
    };

    return handleResponse(await this.aws.invoker(params));
  }
  async findOne(id: string): Promise<any> {
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.LEARNING_SERVICE_NAME,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: `/learning/${id}`,
        httpMethod: 'GET',
      }),
    };

    return handleResponse(await this.aws.invoker(params));
  }
  async update(id: string, data: any): Promise<any> {
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.LEARNING_SERVICE_NAME,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: `/learning/${id}`,
        httpMethod: 'PUT',
        body: JSON.stringify(data),
      }),
    };

    return handleResponse(await this.aws.invoker(params));
  }
}
