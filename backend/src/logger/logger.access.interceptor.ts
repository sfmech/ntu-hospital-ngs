import { Injectable } from '@nestjs/common';
import { NestInterceptor, ExecutionContext, CallHandler, } from '@nestjs/common';
import { Observable } from 'rxjs';

import { LoggerService } from './logger.service';

import { MessageBuilder } from './utils/message.builder';

import { AccessLoggerContext } from './logger.constant';

import * as express from 'express';

@Injectable()
export class LoggerAccessInterceptor implements NestInterceptor {
  constructor(
    private loggerService: LoggerService,
  ) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<express.Request>();
    const controller = context.getClass().name;
    const method = context.getHandler().name;

    this.logHandler(request, controller, method);

    return next.handle();
  }

  logHandler(request: express.Request, controller: string, method: string): void {
    const message = new MessageBuilder()
      .addText(`handler: ${controller}#${method}`)
      .toSring();

    this.loggerService.log(message, AccessLoggerContext);
  }
};
