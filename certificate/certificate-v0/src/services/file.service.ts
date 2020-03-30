import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import AWS = require('aws-sdk');
import dotenv = require('dotenv');
import * as path from 'path';
import { getSecretValue } from './secretManager.service';

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env',
});
process.env = { ...parsed, ...process.env };

const s3 = new AWS.S3();

const asmAccessKeyConf = process.env.LAMBDA_CONF_PREFIX;

getSecretValue(asmAccessKeyConf, (_err, data) => {
  const AWS_ACCESS_KEY_ID = data.host;
  const AWS_SECRET_ACCESS_KEY = data.password;

  AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  });
});

@Injectable()
export class FileService {
  getFileUrl(filePath: string): string {
    const bucketName = this.getS3BucketName('agora');
    return `https://${bucketName}.s3-ap-southeast-1.amazonaws.com/${filePath}`;
  }

  getS3BucketName(org: string): string {
    org = 'agora';
    let bucketName = process.env.AGORA_GENERIC_AWS_S3_BUCKET; // set default bucket to agora generic

    if (org === 'agora') bucketName = process.env.AGORA_GENERIC_AWS_S3_BUCKET;
    else bucketName = process.env.AGORA_SASS_AWS_S3_BUCKET;

    return bucketName;
  }

  download(next: any): any {
    // Download the image from S3 into a buffer.
    s3.getObject(
      {
        Bucket: this.getS3BucketName('agora'),
        Key: 'certificates',
      },
      next
    );
  }

  async upload(id: string, file: any): Promise<any> {
    const bucketName = this.getS3BucketName('agora');
    // Stream the transformed image to a different S3 bucket.
    const params = {
      Bucket: bucketName,
      Key: `${id}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };
    await s3.upload(params).promise();
    // await s3.putObject(params, (err, data) => {
    //   if (err) {
    //     console.error(err, err.stack); // an error occurred
    //   } else {
    //     return Promise.resolve(data);
    //   }
    //   /*
    //   data = {
    //    ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"",
    //    VersionId: "Kirh.unyZwjQ69YxcQLA8z4F5j3kJJKr"
    //   }
    //   */
    // });
  }

  async getSignedUrlUploadObject(type: string, fileKey: string): Promise<any> {
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

      const response: any = {
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
}
