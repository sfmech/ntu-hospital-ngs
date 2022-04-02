import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser'
import { LoggerFactory } from './logger/logger.factory';
import { urlencoded, json } from 'express';

async function bootstrap() {
  const loggerService = LoggerFactory();
  const app = await NestFactory.create(AppModule, {
    logger: loggerService
  });

  const configService: ConfigService = app.get(ConfigService);
  app.useLogger(loggerService);
  app.use(cookieParser());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  const port = configService.get<number>('app.port');

  await app.listen(port);

  const appUrl = await app.getUrl();
  loggerService.log(`Server ready on ${appUrl}`, 'NestApplication');

}
bootstrap();
