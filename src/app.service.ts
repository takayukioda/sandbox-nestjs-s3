import { Injectable } from '@nestjs/common';
import { S3Service } from './aws/s3.service';

@Injectable()
export class AppService {
  constructor(private readonly s3Service: S3Service) {}
  getHello(): string {
    return 'Hello World!';
  }

  async uploadToS3(name: string, raw: Buffer) {
    console.log({ name, raw });
    const buckets = await this.s3Service.listBuckets();
    const objects = await this.s3Service.listObjects(
      'sandbox-nestjs-s3-storage',
    );
    const uploaded = await this.s3Service.pubObject(
      'sandbox-nestjs-s3-storage',
      name,
      raw,
    );
    console.log({ buckets, objects, uploaded });
  }
}
