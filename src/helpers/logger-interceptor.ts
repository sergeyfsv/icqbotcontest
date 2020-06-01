import {AxiosRequestConfig} from "axios";
import log4js from "./logger";
const logger = log4js.getLogger("axios");

export function RequestLoggerInterceptor(config: AxiosRequestConfig): AxiosRequestConfig {
  logger.debug(`${config.method} ${config.url}, params: ${JSON.stringify(config.params)}, data: ${JSON.stringify(config.data)}`);
  return config;
};