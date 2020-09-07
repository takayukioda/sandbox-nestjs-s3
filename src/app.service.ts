import { Injectable } from '@nestjs/common';
import { S3Service } from './aws/s3.service';

@Injectable()
export class AppService {
  #bucket = 'sandbox-nestjs-s3-storage';

  constructor(private readonly s3Service: S3Service) {}
  getHello(): string {
    return 'Hello World!';
  }

  async uploadToS3(name: string, raw: Buffer) {
    const uploaded = await this.s3Service.pubObject(this.#bucket, name, raw);
    console.log({ uploaded });
  }

  async getPresignedUrl(name: string) {
    return this.s3Service.getSignedUrl(this.#bucket, name);
  }

  async deleteFile(name: string) {
    console.log({ name });
    const result = await this.s3Service.deleteObject(this.#bucket, name);
    console.log({ result });
    return result;
  }
}
