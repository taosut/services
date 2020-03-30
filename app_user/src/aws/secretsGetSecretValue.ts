// Load the AWS SDK
import * as AWS from 'aws-sdk';
const region = 'ap-southeast-1';

// Create a Secrets Manager client
const client = new AWS.SecretsManager({
  region,
});

export async function getSecretValue(secretName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    client.getSecretValue({ SecretId: secretName }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        // Decrypts secret using the associated KMS CMK.
        // Depending on whether the secret is a string or binary, one of these fields will be populated.
        if ('SecretString' in data) {
          resolve(data.SecretString);
        } else {
          const buff = new Buffer(data.SecretBinary as string, 'base64');
          resolve(buff.toString('ascii'));
        }
      }
    });
  });
}
