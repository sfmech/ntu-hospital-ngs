import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { LoggerService } from './logger.service';
import { LoggerAccessInterceptor } from './logger.access.interceptor';

import { LoggerAccessMiddleware } from './logger.access.middleware'

@Module({
  providers: [
    LoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerAccessInterceptor,
    }
  ],
  exports: [LoggerService]
})
export class LoggerModule implements NestModule {
  constructor(
    private loggerService: LoggerService
  ) { }
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(...LoggerAccessMiddleware(this.loggerService))
      .exclude(
        { path: '/static/(.*)', method: RequestMethod.GET },
      )
      .forRoutes('/');
  }
}
