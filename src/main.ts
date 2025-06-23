import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(process.env.PORT || 3000);
  Logger.log(`server run on http://localhost:${process.env.PORT ?? 80}/api/v1`);
}
bootstrap();
