import { Injectable } from '@nestjs/common';
import { Lambda } from 'aws-sdk';
import { handleResponse, invoker } from './util';

@Injectable()
export class CompletionInvokeService {
  async find(query: any): Promise<any> {
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.COMPLETION_SERVICE_NAME,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: `/learner/completion`,
        queryStringParameters: query,
        httpMethod: 'GET',
      }),
    };

    return handleResponse(await invoker(params));
  }

  async generateInitialCompletion(
    header: any,
    userId: string,
    classId: string
  ): Promise<any> {
    const headers: any = {};
    headers.accept = 'application/json';
    headers.authorization = header.authorization;
    headers.realm = header.realm;
    headers['Content-Type'] = 'application/json';

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.COMPLETION_SERVICE_NAME,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: `/completion/generate`,
        httpMethod: 'POST',
        body: JSON.stringify({
          user_id: userId,
          class_id: classId,
        }),
      }),
    };

    return handleResponse(await invoker(params));
  }
}
