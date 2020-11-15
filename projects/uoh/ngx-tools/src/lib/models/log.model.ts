import { InjectionToken } from '@angular/core';
import { UohLogger } from '../services/uoh-logger.service';

export enum UohLogLevel {
  FATAL = 0,
  ERROR = 1,
  WARN = 2,
  INFO = 3,
  DEBUG = 4,
  ALL = 5,
}

export interface UohLog {
  level: string;
  message: string;
}

export const UOH_LOGGER_URL = new InjectionToken<string>(
  'The url were to send the UohLogger requests.'
);

export const UOH_LOGGER_LEVEL = new InjectionToken<string>(
  'The log level for the UohLogger.'
);
