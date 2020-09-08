import {
  Controller,
  Delete,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log({ file, byteLength: file.buffer.byteLength });
    await this.appService.uploadToS3(file.originalname, file.buffer, file.mimetype);
  }

  @Get('file/:name')
  async getFileUrl(@Param('name') name: string) {
    const url = await this.appService.getPresignedUrl(name);
    console.log({ url });
    return url;
  }

  @Delete('file/:name')
  async deleteFile(@Param('name') name: string) {
    await this.appService.deleteFile(name);
    return;
  }
}
