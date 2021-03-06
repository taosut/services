import AWS from 'aws-sdk';

const client = new AWS.SecretsManager({
  region: process.env.AWS_REGION,
});

export interface IDbConfig {
  username: string;
  password: string;
  engine: string;
  host: string;
  port: number;
  redisHost: string;
  redisPort: string;
  dbClusterIdentifier: string;
}

export function getSecretValue(
  secretName: string,
  callback: (err: Error, data: IDbConfig) => any
): void {
  client.getSecretValue({ SecretId: secretName }, (err: any, data: any) => {
    if (err) {
      if (err.code === 'DecryptionFailureException')
        // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
        // Deal with the exception here, and/or rethrow at your discretion.
        throw err;
      else if (err.code === 'InternalServiceErrorException')
        // An error occurred on the server side.
        // Deal with the exception here, and/or rethrow at your discretion.
        throw err;
      else if (err.code === 'InvalidParameterException')
        // You provided an invalid value for a parameter.
        // Deal with the exception here, and/or rethrow at your discretion.
        throw err;
      else if (err.code === 'InvalidRequestException')
        // You provided a parameter value that is not valid for the current state of the resource.
        // Deal with the exception here, and/or rethrow at your discretion.
        throw err;
      else if (err.code === 'ResourceNotFoundException')
        // We can't find the resource that you asked for.
        // Deal with the exception here, and/or rethrow at your discretion.
        throw err;
    } else {
      // Decrypts secret using the associated KMS CMK.
      // Depending on whether the secret is a string or binary, one of these fields will be populated.
      if ('SecretString' in data) {
        callback(null, JSON.parse(data.SecretString));
      } else {
        const buff = new Buffer(data.SecretBinary, 'base64');
        const decodedBinarySecret: string = buff.toString('ascii');

        callback(null, JSON.parse(decodedBinarySecret));
      }
    }
  });
}
