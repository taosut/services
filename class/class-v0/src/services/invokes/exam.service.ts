import { Injectable } from '@nestjs/common';
import { Lambda } from 'aws-sdk';
import dotenv = require('dotenv');
import { Unit } from '../../modules/unit/unit.entity';
import { handleResponse, invoker } from '../utils/util';

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env',
});

process.env = { ...parsed, ...process.env };

@Injectable()
export class ExamInvokeService {
  async findByMeta(unit_id: string): Promise<any> {
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.EXAM_SERVICE_NAME,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: `/exam/fetch/byMeta`,
        queryStringParameters: {
          unit_id,
        },
        httpMethod: 'GET',
      }),
    };

    return handleResponse(await invoker(params));
  }
  async create(unit: Unit): Promise<any> {
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';

    const data = {
      title: unit.title,
      meta: {
        class_id: unit.track.class_id,
        track_id: unit.track.id,
        unit_id: unit.id,
      },
    };

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.EXAM_SERVICE_NAME,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: `/exam`,
        body: JSON.stringify(data),
        httpMethod: 'POST',
      }),
    };

    return handleResponse(await invoker(params));
  }
}
