import { Injectable } from '@nestjs/common';
import { S3Service } from './aws/s3.service';

@Injectable()
export class AppService {
  #bucket = 'sandbox-nestjs-s3-storage';

  constructor(private readonly s3Service: S3Service) {}
  getHello(): string {
    return 'Hello World!';
  }

  async uploadToS3(name: string, raw: Buffer, contentType?: string) {
    const hexName = Buffer.from(name).toString('hex')
    const uploaded = await this.s3Service.pubObject(this.#bucket, hexName, raw, { contentType });
    console.log({ hexName, uploaded });
  }

  async getPresignedUrl(name: string) {
    const hexName = Buffer.from(name).toString('hex')
    return this.s3Service.getSignedUrl(this.#bucket, hexName);
  }

  async deleteFile(name: string) {
    const hexName = Buffer.from(name).toString('hex')
    console.log({ name, hexName });
    const result = await this.s3Service.deleteObject(this.#bucket, hexName);
    console.log({ result });
    return result;
  }
}
