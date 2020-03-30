import AWS, { AWSError, MediaConvert } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import dotenv = require('dotenv');
import * as path from 'path';
import { Content } from '../../modules/content/content.entity';
import { cmafParams } from './types/cmaf.param';
import { EEmc } from './types/emc.enum';

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env',
});

process.env = { ...parsed, ...process.env };

const client = new AWS.MediaConvert({
  region: process.env.AWS_REGION,
  endpoint: 'https://rhmkeazva.mediaconvert.ap-southeast-1.amazonaws.com',
});

export async function emcCreateJob(
  org: string,
  bucket: string,
  content: Content
): Promise<PromiseResult<MediaConvert.CreateJobResponse, AWSError>> {
  const filePath = `${bucket}/${content.path}`;
  const filename = path.basename(filePath);
  const dir = path.dirname(filePath);

  const destination = `${EEmc.baseS3URL}${dir}/${EEmc.cmafType}/${filename}`;

  const fileInput = `${EEmc.baseS3URL}${filePath}`;

  cmafParams.Settings.OutputGroups[0].OutputGroupSettings.CmafGroupSettings.Destination = destination;

  cmafParams.Settings.Inputs[0].FileInput = fileInput;

  return await client.createJob(cmafParams).promise();
}
