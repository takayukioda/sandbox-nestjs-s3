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

  async objectExists(bucket: string, key: string): Promise<boolean> {
    assert(bucket, key);
    const params = {
      Bucket: bucket,
      Key: key,
    };
    return this.instance
      .headObject(params)
      .promise()
      .then(() => true)
      .catch(() => false);
  }
  async objectNotExists(bucket: string, key: string): Promise<boolean> {
    return this.objectExists(bucket, key).then((b) => !b);
  }

  async pubObject(
    bucket: string,
    key: string,
    data: Buffer,
    options: { contentType?: string; filename?: string },
  ) {
    assert(bucket, key);
    return this.instance
      .putObject({
        Bucket: bucket,
        Key: key,
        Body: data,
        ContentType: options.contentType ?? 'application/octet-stream',
        ServerSideEncryption: 'AES256',
      })
      .promise();
  }

  async deleteObject(bucket: string, key: string): Promise<boolean> {
    assert(key);
    if (await this.objectNotExists(bucket, key)) {
      return false;
    }
    return this.instance
      .deleteObject({
        Bucket: bucket,
        Key: key,
      })
      .promise()
      .then(() => true)
      .catch((reason) => {
        console.error(reason);
        return false;
      });
  }

  async getSignedUrl(bucket: string, key: string) {
    assert(key);
    if (await this.objectNotExists(bucket, key)) {
      return undefined;
    }
    const params: any = {
      Bucket: bucket,
      Key: key,
      Expires: 300,
    };
    return this.instance.getSignedUrl('getObject', params);
  }
}
