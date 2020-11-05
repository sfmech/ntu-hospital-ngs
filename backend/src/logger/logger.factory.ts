import { WinstonModule } from 'nest-winston';

import * as winston from 'winston';
import 'winston-daily-rotate-file';

import * as path from 'path';

const defaultLogPath = path.resolve(__dirname, '../../var/logs');

// for main.ts
export const LoggerFactory = () => WinstonModule.createLogger({
  transports: [
    new winston.transports.DailyRotateFile({
      filename: `${process.env.NODE_ENV}.%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      level: process.env.FILE_LOG_LEVEL ?? 'info',
      dirname: process.env.LOG_DIRECTORY ?? defaultLogPath,
      handleExceptions: true,
      json: true,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp, context }) => {
          return `${timestamp} ${level} [${context}]: ${message}`;
        })
      )
    }),
    new winston.transports.Console({
      level: process.env.CONSOLE_LOG_LEVEL ?? 'info',
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, context }) => {
          return `${level} [${context}]: ${message}`;
        })
      )
    })
  ],
  exitOnError: false
});
