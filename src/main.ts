import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Athletics OpenAPI')
    .setDescription('Athletics API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/openapi', app, document, {
    customSiteTitle: 'Swagger UI for athletics',
    swaggerOptions: { docExpansion: 'none' },
  });

  await app.listen(9000);
}
bootstrap();
