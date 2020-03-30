import { Injectable } from '@nestjs/common';
import { SNS } from 'aws-sdk';
const sns = new SNS({ region: 'ap-southeast-1' });

@Injectable()
export default class SNSService {
  async publish(data: any): Promise<any> {
    const params = {
      Message: JSON.stringify(data),
      TopicArn: `arn:aws:sns:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:${process.env.SNS_TOPIC_NAME}`,
    };
    return sns.publish(params).promise();
  }
}
