import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AWSModule } from './aws/aws.module';

@Module({
  imports: [AWSModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
