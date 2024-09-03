import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { GlobalErrorInterceptor } from './intercaptors/error-intercaptor';
import * as fetch from 'node-fetch';

(global as any).fetch = fetch;

function globalPipe() {
  return new ValidationPipe({
    exceptionFactory: (errors) => new BadRequestException(errors),
    transform: true,
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(globalPipe());

  app.useGlobalInterceptors(new GlobalErrorInterceptor());

  await app.listen(3000);
}
bootstrap();
