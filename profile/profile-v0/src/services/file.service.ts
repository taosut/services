import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as path from 'path';
import { IFile } from '../interfaces/content.interface';

const s3Client = new S3();
// config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// });

@Injectable()
export class FileService {
  async getFileUrl(filePath: string): Promise<string> {
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3-${process.env
      .AWS_REGION || 'ap-southeast-1'}.amazonaws.com/${filePath}`;
  }

  async openFileS3(filePath: string): Promise<AWS.S3.GetObjectOutput> {
    const param: AWS.S3.Types.GetObjectRequest = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: filePath,
    };

    const result = await s3Client.getObject(param).promise();

    return result;
  }

  async upload(fileData: IFile, fileName: string): Promise<string> {
    const extension = path.extname(fileData.originalname);
    const dir = `user-photos/`;
    const filePath = dir + fileName.toLowerCase();
    const fileKey = filePath + extension;
    const params: any = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
      ACL: 'public-read',
      ContentType: fileData.mimetype,
      Body: fileData.buffer,
    };

    try {
      await s3Client.upload(params).promise();

      delete fileData.buffer;
      delete params.Body.buffer;

      return Promise.resolve(fileKey);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async delete(filePath: string): Promise<object> {
    const params: AWS.S3.Types.PutObjectRequest = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: filePath,
    };

    return await s3Client.deleteObject(params).promise();
  }
}
