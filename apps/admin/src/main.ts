import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import 'dotenv/config';
import { webcrypto } from 'crypto';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from '@app/common/filters/exception.filter';
import { User } from '@app/common/database/entities';
import { Request } from 'express';

if (typeof globalThis.crypto === 'undefined') {
  // @ts-ignore
  globalThis.crypto = webcrypto;
}

export interface AuthRequest extends Request {
  user: User;
}

const PORT = process.env.PORT_ADMIN || 3001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    transformOptions: { enableImplicitConversion: true },
  }));
  app.enableCors();
  // app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(PORT);
  console.log(`App running on port ${PORT}`);
  // const bcrypt = require('bcrypt');

}

bootstrap();
