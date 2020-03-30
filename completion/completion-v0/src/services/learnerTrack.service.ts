import { Injectable } from '@nestjs/common';
import { Lambda } from 'aws-sdk';
import dotenv = require('dotenv');
import AWSInvoker from './invoker.service';
import { handleResponse } from './util';

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env',
});

process.env = { ...parsed, ...process.env };

@Injectable()
export class LearnerTrackInvokeService {
  private aws: any;
  constructor() {
    this.aws = new AWSInvoker();
  }
  async find(query: any): Promise<any> {
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.TRACK_SERVICE_NAME,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: `/learner/tracks`,
        queryStringParameters: query,
        httpMethod: 'GET',
      }),
    };

    return handleResponse(await this.aws.invoker(params));
  }
  async findLearning(query: any): Promise<any> {
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.TRACK_SERVICE_NAME,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: `/learner/learnings`,
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
      FunctionName: process.env.TRACK_SERVICE_NAME,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: `/tracks/${id}`,
        httpMethod: 'GET',
      }),
    };

    return handleResponse(await this.aws.invoker(params));
  }
}
