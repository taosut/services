import { Injectable } from '@nestjs/common';
import { Lambda } from 'aws-sdk';
import { handleResponse, invoker } from './util';

@Injectable()
export class UnitInvokeService {
  async findOne(
    classId: string,
    trackId: string,
    unitId: string
  ): Promise<any> {
    console.info('classId', classId);
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.CLASS_SERVICE_NAME,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: `/track/${trackId}/unit/${unitId}`,
        httpMethod: 'GET',
      }),
    };

    return handleResponse(await invoker(params));
  }
}
