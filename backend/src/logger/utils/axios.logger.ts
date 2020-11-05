import { LoggerService } from '../logger.service';
import { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

import { MessageBuilder } from './message.builder'

import { AxiosLoggerContext } from '../logger.constant';

import isAbsoluteURL = require('axios/lib/helpers/isAbsoluteURL');
import buildURL = require('axios/lib/helpers/buildURL');
import combineURLs = require('axios/lib/helpers/combineURLs');

type withCustomConfig = {
  config: Record<string, string>;
};

type AxiosLoggerResponse = AxiosResponse & withCustomConfig;

type AxiosLoggerError = AxiosError & withCustomConfig;

export class AxiosLogger {
  static URL_KEY = '__AXIOSLOGGER_URL__';

  static getURL(config: AxiosRequestConfig): string {
    let url = config.url;
    if (config.baseURL && !isAbsoluteURL(url)) {
      url = combineURLs(config.baseURL, url);
    }
    return buildURL(url, config.params, config.paramsSerializer) as string;
  }

  static onRequest(loggerService: LoggerService, config: AxiosRequestConfig): void {
    const url = AxiosLogger.getURL(config);
    Object.defineProperty(config, AxiosLogger.URL_KEY, { value: url });

    const method = config.method || 'unknown';

    return loggerService.log(`${method.toUpperCase()} ${url}`, AxiosLoggerContext);
  }

  static onResponse(loggerService: LoggerService, response: AxiosLoggerResponse): void {
    const url = response.config[AxiosLogger.URL_KEY];

    const responseMessage = `${response.status} ${response.statusText}`;

    const method = response.config.method || 'unknown';
    const requestMessage = `${method.toUpperCase()} ${url}`;

    return loggerService
      .log(`${responseMessage} (${requestMessage})`, AxiosLoggerContext);
  }

  static onError(loggerService: LoggerService, error: AxiosLoggerError): void {
    const messageBuilder = new MessageBuilder();

    const errorMessage = `${error.name}: ${error.message}`;
    messageBuilder.addText(errorMessage);

    if (error.config) {
      const url = error.config[AxiosLogger.URL_KEY];

      const method = error.config.method || 'unknown';
      const requestMessage = `${method.toUpperCase()} ${url}`;
      messageBuilder.addText(`(${requestMessage})`);

      if (error.response !== undefined && error.response.data !== undefined) {
        messageBuilder.newLine(`  ${JSON.stringify(error.response.data)}`);
      }
    }

    return loggerService
      .error(messageBuilder.toSring(), error.stack, AxiosLoggerContext);
  }

  static attach(instance: AxiosInstance, loggerService: LoggerService): void {
    const onRequest = (config: AxiosRequestConfig) => {
      AxiosLogger.onRequest(loggerService, config);

      return config;
    };

    const onResponse = (response: AxiosResponse) => {
      AxiosLogger.onResponse(loggerService, response as AxiosLoggerResponse);

      return response;
    };

    const onError = (error: AxiosError) => {
      AxiosLogger.onError(loggerService, error as AxiosLoggerError);

      throw error;
    };

    instance.interceptors.request.use(onRequest, onError);
    instance.interceptors.response.use(onResponse, onError);
  }
}
