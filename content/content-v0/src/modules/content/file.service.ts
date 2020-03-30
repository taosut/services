import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import AWS = require('aws-sdk');
import dotenv = require('dotenv');
import * as path from 'path';
import { EEmc } from '../../services/emc/types/emc.enum';
// import { getSecretValue } from '../../services/ssm/secretManager.service';
import { Content } from './content.entity';
import { EContentType } from './types/content.enum';
import { SignedUrlResponse } from './types/content.type';

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env',
});

process.env = { ...parsed, ...process.env };

const s3 = new AWS.S3();

let AWS_ACCESS_KEY_ID;
let AWS_SECRET_ACCESS_KEY;

AWS_ACCESS_KEY_ID = 'AKIATAPZ4VCICLK5MWYG';
AWS_SECRET_ACCESS_KEY = '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';

// const asmAccessKeyConf = process.env.LAMBDA_CONF_PREFIX;

// getSecretValue(asmAccessKeyConf, (_err, data) => {
//   AWS_ACCESS_KEY_ID = data.host;
//   AWS_SECRET_ACCESS_KEY = data.password;
//   AWS.config.update({
//     accessKeyId: AWS_ACCESS_KEY_ID,
//     secretAccessKey: AWS_SECRET_ACCESS_KEY,
//     region: process.env.AWS_REGION,
//   });
// });

const signer = new AWS.CloudFront.Signer(
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY
);

@Injectable()
export class FileService {
  async getFileUrl(filePath: string): Promise<string> {
    const bucketName = this.getS3BucketName('agora');

    // const params = {
    //   Bucket: bucketName,
    //   Key: filePath,
    //   Expires: 60,
    // };
    // const signedURL = await s3.getSignedUrl('getObject', params);
    // return signedURL;

    const url =
      'https://d2jl89uk18l1rd.cloudfront.net/agora/video/raw/f4504ba7-dba3-4202-9fd1-3fc5bfcef87f/cmaf/f4504ba7-dba3-4202-9fd1-3fc5bfcef87f-teaserhowtolearn.mp4.m3u8';

    const signedUrl = signer.getSignedUrl({
      url,
      expires: 240,
    });

    console.info(signedUrl);
    return `https://${bucketName}.s3-ap-southeast-1.amazonaws.com/${filePath}`;
  }

  async getSignedUrlUploadObject(
    type: string,
    fileKey: string
  ): Promise<SignedUrlResponse> {
    const bucketName = this.getS3BucketName('agora');
    const params = {
      Bucket: bucketName,
      Key: fileKey,
      ContentType: type,
      Expires: 240,
      ACL: 'public-read',
    };

    try {
      const signedURL = await s3.getSignedUrl('putObject', params);

      const urlSplit = signedURL.split('&');

      let token = null;
      let elementToRemove = null;
      let finalUrl = null;

      urlSplit.forEach((element: string, index: number) => {
        if (element.includes('x-amz-security-token=')) {
          elementToRemove = '&' + element;
          token = element.replace('x-amz-security-token=', '');
          urlSplit.splice(index, 1);
        }
      });

      if (elementToRemove) {
        finalUrl = signedURL.replace(elementToRemove, '');
      }

      const response: SignedUrlResponse = {
        type,
        path: fileKey,
        name: path.basename(fileKey),
        url: finalUrl
          ? decodeURIComponent(finalUrl)
          : decodeURIComponent(signedURL),
        token_name: 'x-amz-security-token',
        token: decodeURIComponent(token),
      };

      return response;
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
        },
        error.statusCode || HttpStatus.FORBIDDEN
      );
    }
  }

  async getSignedUrlGetObject(contentEntity: Content): Promise<string> {
    // const filePath = this.resolveFilePath(contentEntity);

    // const bucketName = this.getS3BucketName('agora');

    // const params = {
    //   Bucket: bucketName,
    //   Key: filePath,
    //   Expires: 60,
    //   ResponseContentType: contentEntity.file_type,
    // };

    // const isObjectExist = await this.isFileExist(filePath);

    // if (isObjectExist) {
    //   const signedURL = await s3.getSignedUrl('getObject', params);
    //   return decodeURIComponent(signedURL);
    // }
    return this.getFileUrl(contentEntity.path);
  }

  async isFileExist(filePath: string): Promise<boolean> {
    try {
      const bucketName = this.getS3BucketName('agora');

      const isObjectExist = await s3
        .headObject({ Bucket: bucketName, Key: filePath })
        .promise();

      if (isObjectExist) return true;
    } catch (error) {
      return false;
    }
  }
  async delete(filePath: string): Promise<object> {
    const bucketName = this.getS3BucketName('agora');
    const params: AWS.S3.Types.PutObjectRequest = {
      Bucket: bucketName,
      Key: filePath,
    };

    return await s3.deleteObject(params).promise();
  }

  getS3BucketName(org: string): string {
    org = 'agora';
    let bucketName = process.env.AGORA_GENERIC_AWS_S3_BUCKET; // set default bucket to agora generic

    if (org === 'agora') bucketName = process.env.AGORA_GENERIC_AWS_S3_BUCKET;
    else bucketName = process.env.AGORA_SASS_AWS_S3_BUCKET;

    return `${bucketName}-${process.env.STAGE || 'dev'}`;
  }

  resolveFilePath(contentEntity: Content): string {
    let fileKey = contentEntity.path;
    if (contentEntity.file_type === EContentType.mp4) {
      const dir = path.dirname(fileKey);
      const filename = path.basename(fileKey);
      fileKey = `${dir}/${EEmc.cmafType}/${filename}${EEmc.m3u8Ext}`;
    }

    // console.info(fileKey);

    return fileKey;
  }
}
