import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import AWS = require('aws-sdk');
import * as crypto from 'crypto';
import dotenv = require('dotenv');
import * as path from 'path';

import { IFile, ISignedUrlResponse } from './interfaces/content.interface';

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env',
});

process.env = { ...parsed, ...process.env };

const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const s3 = new AWS.S3();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const multipartMap = {
  Parts: [],
};

@Injectable()
export class FileService {
  async getFileUrl(filePath: string): Promise<string> {
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3-ap-southeast-1.amazonaws.com/${filePath}`;
  }

  async openFileS3(filePath: string): Promise<AWS.S3.GetObjectOutput> {
    const param: AWS.S3.Types.GetObjectRequest = {
      Bucket: AWS_S3_BUCKET_NAME,
      Key: filePath,
    };

    const result = await s3.getObject(param).promise();

    return result;
  }

  async upload(fileData: IFile, fileName: string): Promise<string> {
    const extension = path.extname(fileData.originalname);
    const dir = `files/uploads/`;
    const filePath = dir + fileName.toLowerCase();
    const fileKey = filePath + extension;
    const multiPartParams: AWS.S3.CreateMultipartUploadRequest = {
      Bucket: AWS_S3_BUCKET_NAME,
      Key: fileKey,
      ACL: 'public-read',
      ContentType: fileData.mimetype,
    };

    // const params: AWS.S3.Types.PutObjectRequest = {
    //   Bucket: AWS_S3_BUCKET_NAME,
    //   Key: fileKey,
    //   Body: fileData.buffer,
    //   ACL: 'public-read',
    //   ContentType: fileData.mimetype,
    // };

    try {
      const multipart = await s3
        .createMultipartUpload(multiPartParams)
        .promise();

      const response = await this.uploadMultiPart(
        multipart,
        fileData.buffer,
        fileKey
      );

      // const response = await s3.upload(params).promise();

      return response.Key;
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }

  async getSignedUrl(
    type: string,
    fileKey: string
  ): Promise<ISignedUrlResponse> {
    const params = {
      Bucket: AWS_S3_BUCKET_NAME,
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

      const response: ISignedUrlResponse = {
        ContentType: type,
        filePath: fileKey,
        filename: path.basename(fileKey),
        url: finalUrl
          ? decodeURIComponent(finalUrl)
          : decodeURIComponent(signedURL),
        securityTokenName: 'x-amz-security-token',
        securityToken: decodeURIComponent(token),
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

    // try {
    //   const signedUrl = s3.getSignedUrl('putObject', {
    //     Bucket: AWS_S3_BUCKET_NAME,
    //     Key: fileKey,
    //     Expires: 120,
    //     ContentType: `multipart/form-data`,
    //   });

    //   const headers = req.headers;
    //   const host = headers.host;
    //   const urlParser = url.parse(signedUrl);

    //   // const hash = crypto
    //   //   .createHash('sha256')
    //   //   .update(urlParser.path)
    //   //   .digest('hex');

    //   // const putObjectResponse = await s3
    //   //   .putObject({
    //   //     Bucket: AWS_S3_BUCKET_NAME,
    //   //     Key: `signatures/valid/${hash}`,
    //   //     Body: JSON.stringify({ created: Date.now() }),
    //   //     ContentType: 'application/json',
    //   //     ContentEncoding: 'gzip',
    //   //   })
    //   //   .promise();

    //   console.info('signedUrl', signedUrl);
    //   console.info('signedUrl', decodeURIComponent(signedUrl));
    //   // console.info('putObjectResponse', putObjectResponse);

    //   const response = {
    //     status: '200',
    //     statusDescription: 'OK',
    //     headers: {
    //       'content-type': [
    //         {
    //           key: 'Content-Type',
    //           value: 'text/plain',
    //         },
    //       ],
    //       'content-encoding': [
    //         {
    //           key: 'Content-Encoding',
    //           value: 'UTF-8',
    //         },
    //       ],
    //     },
    //     body: `https://${host}/validate-url${decodeURIComponent(
    //       urlParser.path
    //     )}`,
    //   };

    //   return response;
    // } catch (error) {
    //   throw new HttpException(error.message, error.statusCode);
    // }
  }

  async validateSignedUrl(request: any): Promise<object> {
    const forbiddenResponse = {
      status: '403',
      statusDescription: 'Forbidden',
      headers: {
        'content-type': [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
        ],
        'content-encoding': [
          {
            key: 'Content-Encoding',
            value: 'UTF-8',
          },
        ],
      },
      body: 'Forbidden',
    };
    try {
      const querystring = request.querystring;
      const uri = request.url;

      const hash = crypto
        .createHash('sha256')
        .update(`${uri}?${querystring}`)
        .digest('hex');

      const [validSignature, expiredSignature] = await Promise.all([
        await this.headSignature({ type: 'valid', hash }),
        await this.headSignature({ type: 'expired', hash }),
      ]);

      if (!validSignature || expiredSignature) {
        return forbiddenResponse;
      }

      const { VersionId: version } = await s3
        .putObject({
          Bucket: AWS_S3_BUCKET_NAME,
          Key: `signatures/expired/${hash}`,
          Body: JSON.stringify({ created: Date.now() }),
          ContentType: 'application/json',
          ContentEncoding: 'gzip',
        })
        .promise();

      const { Versions: versions } = await s3
        .listObjectVersions({
          Bucket: AWS_S3_BUCKET_NAME,
          Prefix: `signatures/expired/${hash}`,
        })
        .promise();

      const sortedVersions = versions.concat().sort((a, b): any => {
        return a.LastModified > b.LastModified;
      });

      // if there are more that one version of the index file and current is not the initial version
      if (
        sortedVersions.length > 1 &&
        sortedVersions[0].VersionId !== version
      ) {
        return forbiddenResponse;
      }

      return request;
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }

  async headSignature({ type, hash }: any): Promise<boolean> {
    const key = `signatures/${type}/${hash}`;
    try {
      await s3
        .headObject({
          Bucket: AWS_S3_BUCKET_NAME,
          Key: key,
        })
        .promise();
      return true;
    } catch (error) {
      return false;
    }
  }

  async uploadMultiPart(
    multiPart: AWS.S3.CreateMultipartUploadOutput,
    buffer: Buffer,
    fileKey: string
  ): Promise<AWS.S3.CompleteMultipartUploadOutput> {
    try {
      const partSize = 1024 * 1024 * 5;
      let numPartsLeft = Math.ceil(buffer.length / partSize);

      let partNum = 0;
      let response = null;
      for (
        let rangeStart = 0;
        rangeStart < buffer.length;
        rangeStart += partSize
      ) {
        partNum++;

        const end = Math.min(rangeStart + partSize, buffer.length);

        const partParams: AWS.S3.UploadPartRequest = {
          Body: buffer.slice(rangeStart, end),
          Bucket: AWS_S3_BUCKET_NAME,
          Key: fileKey,
          PartNumber: Number(partNum),
          UploadId: multiPart.UploadId,
        };

        // Send a single part
        console.info(
          'Uploading part: #',
          partParams.PartNumber,
          ', Range start:',
          rangeStart
        );

        const stillHavePart = --numPartsLeft > 0;
        console.info(rangeStart, stillHavePart);
        const uploadPartOutput = await this.uploadPart(
          multiPart,
          partParams,
          fileKey,
          stillHavePart
        );

        if (uploadPartOutput) {
          response = uploadPartOutput;
        }

        console.info('uploadPartOutput', uploadPartOutput);
      }
      console.info('response', response);
      return response;
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }

  async uploadPart(
    multiPart: AWS.S3.CreateMultipartUploadOutput,
    partParams: AWS.S3.UploadPartRequest,
    fileKey: string,
    stillHavePart: boolean
  ): Promise<AWS.S3.CompleteMultipartUploadOutput> {
    // const tryNum = 1;
    // const maxUploadTries = 3;
    try {
      const uploadPartOutput = await s3.uploadPart(partParams).promise();

      multipartMap.Parts[partParams.PartNumber - 1] = {
        ETag: uploadPartOutput.ETag,
        PartNumber: Number(partParams.PartNumber),
      };

      const doneParams = {
        Bucket: AWS_S3_BUCKET_NAME,
        Key: fileKey,
        MultipartUpload: multipartMap,
        UploadId: multiPart.UploadId,
      };

      if (!stillHavePart) {
        const response = await s3.completeMultipartUpload(doneParams).promise();
        return response;
      }
    } catch (error) {
      // if (tryNum < maxUploadTries) {
      //   tryNum++;
      //   return await this.uploadPart(
      //     multiPart,
      //     partParams,
      //     fileKey,
      //     stillHavePart
      //   );
      // } else {
      throw new HttpException(error.message, error.statusCode);
      // }
    }
  }

  async delete(filePath: string): Promise<object> {
    const params: AWS.S3.Types.PutObjectRequest = {
      Bucket: AWS_S3_BUCKET_NAME,
      Key: filePath,
    };

    return await s3.deleteObject(params).promise();
  }
}
