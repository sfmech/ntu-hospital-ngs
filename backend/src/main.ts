import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
  });

  const configService: ConfigService = app.get(ConfigService);
  app.use(cookieParser());
  const port = configService.get<number>('app.port');

  await app.listen(port);

  const appUrl = await app.getUrl();
  console.log(`Server ready on ${appUrl}`, 'NestApplication');

}
bootstrap();
