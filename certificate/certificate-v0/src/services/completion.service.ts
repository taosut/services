import { Injectable } from '@nestjs/common';
import { Lambda } from 'aws-sdk';
import { handleResponse, invoker } from '../utils/util';

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
        path: `/completion`,
        queryStringParameters: query,
        httpMethod: 'GET',
      }),
    };

    return handleResponse(await invoker(params));
  }

  async generateCertificateData(query: any, header: any): Promise<any> {
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
        path: `/completion/certificate`,
        httpMethod: 'POST',
        body: JSON.stringify({
          user_id: query.user_id,
          class_id: query.class_id,
        }),
      }),
    };

    return handleResponse(await invoker(params));
  }
}
