import * as morgan from 'morgan';

import { LoggerService } from '@nestjs/common';

import { MessageBuilder } from './utils/message.builder';

import { AccessLoggerContext } from './logger.constant';

export const LoggerAccessMiddleware = (logger: LoggerService) => [
  // for request
  morgan((tokens, req, res) => {
    const method = tokens['method'](req, res) ?? '-';
    const url = tokens['url'](req, res) ?? '-';
    const httpVersion = tokens['http-version'](req, res) ?? '-';
    const remoteAddr = tokens['remote-addr'](req, res) ?? '-';
    const referrer = tokens['referrer'](req, res) ?? '-';

    return new MessageBuilder()
      .addText(`request: ${method} ${url}`)
      .newLine(`  HTTP/${httpVersion} - '${remoteAddr}' - ${referrer}`)
      .toSring();
  }, {
    immediate: true,
    stream: {
      write: (message: any) => {
        logger.log(message.replace(/\s+$/g, ''), AccessLoggerContext);
      }
    }
  }),

  // for response
  morgan((tokens, req, res) => {
    const method = tokens['method'](req, res) ?? '-';
    const url = tokens['url'](req, res) ?? '-';
    const status = tokens['status'](req, res) ?? '-';
    const responseTime = tokens['response-time'](req, res) ?? '-';
    const contentLength = tokens.res(req, res, 'content-length') ?? '-';

    return new MessageBuilder()
      .addText(`response: ${method} ${url} ${status}`)
      .newLine(`  - ${responseTime} ms - ${contentLength} bytes`)
      .toSring();
  }, {
    stream: {
      write: (message: string) => {
        logger.log(message.replace(/\s+$/g, ''), AccessLoggerContext);
      }
    },
  })
];
