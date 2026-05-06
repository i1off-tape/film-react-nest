import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { RequestMethod } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/afisha', {
    exclude: [{ path: 'order', method: RequestMethod.POST }],
  });
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
