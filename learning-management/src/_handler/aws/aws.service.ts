import uuid = require('uuid');

// Load the AWS SDK for Node.js
import * as AWS from 'aws-sdk';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Service dealing with track based operations.
 *
 * @class
 */
export class AwsService {
    private readonly s3;
    constructor() {
        // Set the region
        AWS.config.update({
            region: process.env.AWS_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });

        // // Create S3 service object
        this.s3 = new AWS.S3({apiVersion: '2019-06-20'});
    }
    /**
     * Test
     *
     * @function
     */
    async test() {
        console.info('AWS test');
    }
    /**
     * Upload File
     *
     * @function
     */
    async upload(prefix: string = null, file) {
        console.log('start upload');
        // // call S3 to retrieve upload file to specified bucket
        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: '',
            Body: '',
            Delimiter: '/',
            Prefix: prefix ? prefix + '/' : prefix,
        };
        console.log('before fileStream');
        uploadParams.Body = file.buffer;

        const expExtension = file.originalname.split('.');
        const extension = expExtension[expExtension.length - 1];
        const fileName = uuid.v4() + '.' + extension;
        uploadParams.Key = (prefix ? prefix + '/' : prefix) + fileName;

        // call S3 to retrieve upload file to specified bucket
        const result = await this.s3.upload(uploadParams).promise();

        return {
            ...result,
            fileName,
        };
    }

    async fetchList(prefix: string = null) {
        // Create the parameters for calling listObjects
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Delimiter: '/',
            Prefix: prefix ? prefix + '/' : prefix,
            Marker: '',
        };

        let keys = [];
        for (;;) {
            // Call S3 to obtain a list of the objects in the bucket
            const data = await this.s3.listObjects(params).promise();

            for (const elem of data.Contents) {
                const keyName = elem.Key.split('/');
                keys = keys.concat(keyName[1]);
            }

            if (!data.IsTruncated) {
                break;
            }
            params.Marker = data.NextMarker;
            // let objects = await this.s3.listObjects(params);
            // console.log('OBJECTS', objects.response);
        }
        return keys;
    }

    async fetchOne(prefix: string = null, key: string) {
        const folderPath = '/tmp/assets/temp_download/' + (prefix ? prefix + '/' : prefix);
        // Create the parameters for calling listObjects
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: (prefix ? prefix + '/' : prefix) + key,
        };

        if (!fs.existsSync('/tmp')) {
            console.log('create folder assets');
            fs.mkdir('/tmp', (err) => {
                if (err) { throw err; }
            });
        }

        if (!fs.existsSync('/tmp/assets')) {
            console.log('create folder assets');
            fs.mkdir('/tmp/assets', (err) => {
                if (err) { throw err; }
            });
        }

        if (!fs.existsSync('/tmp/assets/temp_download')) {
            console.log('create folder temp_download');
            fs.mkdir('/tmp/assets/temp_download', (err) => {
                if (err) { throw err; }
            });
        }

        if (prefix && !fs.existsSync('/tmp/assets/temp_download/' + prefix)) {
            console.log('create folder ' + prefix);
            fs.mkdir('/tmp/assets/temp_download/' + prefix, (err) => {
                if (err) { throw err; }
            });
        }

        // // Call S3 to obtain a list of the objects in the bucket
        const data = await this.s3.getObject(params).promise();

        if (data) {
            fs.writeFileSync(folderPath + key, data.Body, 'binary');
            console.log(`${folderPath + key} has been created!`);
        }
        return folderPath + key;
    }

    async delete(prefix: string = null, key: string) {
        // Create the parameters for calling listObjects
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: (prefix ? prefix + '/' : prefix) + key,
        };

        // // Call S3 to obtain a list of the objects in the bucket
        return await this.s3.deleteObject(params).promise();
    }
}
