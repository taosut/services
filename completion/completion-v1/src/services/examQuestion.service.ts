import { Injectable } from '@nestjs/common';
import { Lambda } from 'aws-sdk';
import { handleResponse, invoker } from './util';

@Injectable()
export class ExamQuestionInvokeService {
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
        path: `/question`,
        queryStringParameters: query,
        httpMethod: 'GET',
      }),
    };

    return handleResponse(await invoker(params));
  }

  async findOne(questionId: string, query: any): Promise<any> {
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.EXAM_SERVICE_NAME,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: `/question/${questionId}/answer`,
        queryStringParameters: query,
        httpMethod: 'GET',
      }),
    };

    return handleResponse(await invoker(params));
  }
}
