import { HttpException, Injectable } from '@nestjs/common';
import { Lambda } from 'aws-sdk';
import _ from 'lodash';

@Injectable()
export default class AWSInvoker {
  private lambda: Lambda;

  constructor() {
    this.lambda = new Lambda({ region: 'ap-southeast-1' });
  }

  async invoker(params: Lambda.Types.InvocationRequest): Promise<string> {
    try {
      const result = await this.lambda.invoke(params).promise();
      const resPayload: {
        statusCode: number;
        body: string;
        headers: any;
      } = JSON.parse(result.Payload.toString());

      if (resPayload.statusCode === 500) {
        throw new HttpException(
          resPayload.body && !JSON.parse(resPayload.body)
            ? resPayload.body
            : `${resPayload.statusCode} Error invoking lambda function ` +
              params.FunctionName +
              ' ::: ' +
              JSON.stringify(params.Payload),
          resPayload.statusCode
        );
      } else if (resPayload.statusCode >= 400) {
        throw new HttpException(
          { ...resPayload, message: resPayload.body },
          resPayload.statusCode
        );
      }
      return resPayload.body;
    } catch (error) {
      throw new HttpException(error.message, error.statusCode || 500);
    }
  }
}
