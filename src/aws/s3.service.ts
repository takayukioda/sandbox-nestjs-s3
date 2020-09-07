import * as AWS from 'aws-sdk';
import * as assert from 'assert';

export class S3Service {
  #s3: AWS.S3 | undefined;

  private get instance() {
    if (this.#s3 !== undefined) {
      return this.#s3;
    }
    AWS.config.update({ region: 'ap-northeast-1' });
    AWS.config.credentials = new AWS.SharedIniFileCredentials({
      profile: process.env.AWS_PROFILE,
    });
    this.#s3 = new AWS.S3({ apiVersion: '2006-03-01' });
    return this.#s3;
  }

  async listBuckets(): Promise<AWS.S3.ListBucketsOutput> {
    return this.instance.listBuckets().promise();
  }

  async listObjects(bucket: string) {
    return this.instance.listObjectsV2({ Bucket: bucket }).promise();
  }

  async pubObject(bucket: string, key: string, data: Buffer) {
    assert(bucket, key);
    return this.instance
      .putObject({
        Bucket: bucket,
        Key: key,
        Body: data,
      })
      .promise();
  }

  getSignedUrl(bucket: string, key: string) {
    assert(key);
    return this.instance.getSignedUrl('getObject', {
      Bucket: bucket,
      Key: key,
    });
  }
}
