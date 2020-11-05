import { LoggerService } from '../logger.service';

import { MessageBuilder } from './message.builder';

import { DatabaseLoggerContext } from '../logger.constant';
import { PlatformTools } from 'typeorm/platform/PlatformTools';
import * as typeorm from 'typeorm';

/**
 * ref
 * https://github.com/typeorm/typeorm/blob/master/docs/logging.md#using-custom-logger
 * https://github.com/typeorm/typeorm/blob/master/src/logger/DebugLogger.ts
 */
export class DatabaseLogger implements typeorm.Logger {

  constructor(private logger: LoggerService) { }

  logQuery(
    query: string, parameters?: any[],
    queryRunner?: typeorm.QueryRunner,
  ): void {
    const messageBuilder = new MessageBuilder();

    messageBuilder.addText(`Query: ${PlatformTools.highlightSql(query)};`);

    if (parameters && parameters.length) {
      messageBuilder.newLine(`  parameters: ${parameters}`);
    }

    this.logger.log(messageBuilder.toSring(), DatabaseLoggerContext);
  }

  logQueryError(
    error: string, query: string, parameters?: any[],
    queryRunner?: typeorm.QueryRunner,
  ): void {
    const messageBuilder = new MessageBuilder();

    messageBuilder.addText(`QueryError: ${PlatformTools.highlightSql(query)};`);

    if (parameters && parameters.length) {
      messageBuilder.newLine(`  parameters: ${parameters}`);
    }

    messageBuilder.newLine(`  error: ${error}`);

    this.logger.error(messageBuilder.toSring(), '', DatabaseLoggerContext);
  }

  logQuerySlow(
    time: number, query: string, parameters?: any[],
    queryRunner?: typeorm.QueryRunner,
  ): void {
    const messageBuilder = new MessageBuilder();

    messageBuilder.addText(`QuerySlow: ${PlatformTools.highlightSql(query)};`);

    if (parameters && parameters.length) {
      messageBuilder.newLine(`  parameters: ${parameters}`);
    }

    messageBuilder.newLine(`  execution time: ${time}`);

    this.logger.warn(messageBuilder.toSring(), DatabaseLoggerContext);
  }

  logSchemaBuild(
    message: string,
    queryRunner?: typeorm.QueryRunner,
  ): void {
    const messageBuilder = new MessageBuilder();

    messageBuilder.addText(`SchemaBuild: ${message}`);

    this.logger.log(messageBuilder.toSring(), DatabaseLoggerContext);
  }

  logMigration(
    message: string,
    queryRunner?: typeorm.QueryRunner,
  ): void {
    const messageBuilder = new MessageBuilder();

    messageBuilder.addText(`Migration: ${message}`);

    this.logger.log(messageBuilder.toSring(), DatabaseLoggerContext);
  }

  log(
    level: 'log' | 'info' | 'warn', message: string,
    queryRunner?: typeorm.QueryRunner,
  ): void {
    const messageBuilder = new MessageBuilder();

    switch (level) {
      case 'log':
        messageBuilder.addText(`Log: ${message}`);
        break;
      case 'info':
        messageBuilder.addText(`Info: ${message}`);
        break;

      case 'warn':
        messageBuilder.addText(`Warn: ${message}`);
        break;
    }

    this.logger.log(messageBuilder.toSring(), DatabaseLoggerContext);
  }
}
