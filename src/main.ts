import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  app.setGlobalPrefix('api/v1');
  await app.listen(process.env.PORT || 3000);
  Logger.log(`server run on http://localhost:${process.env.PORT ?? 80}/api/v1`);
}
bootstrap();
