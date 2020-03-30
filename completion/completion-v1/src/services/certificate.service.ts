import { Injectable } from '@nestjs/common';
import { Lambda } from 'aws-sdk';
import { handleResponse, invoker } from './util';

@Injectable()
export class CertificateInvokeService {
  async create(data: any, header: any): Promise<any> {
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';
    headers.realm = header.realm;
    headers.authorization = header.authorization;

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.CERTIFICATE_SERVICE_NAME,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: `/certificates`,
        httpMethod: 'POST',
        body: JSON.stringify(data),
      }),
    };

    return handleResponse(await invoker(params));
  }
}
