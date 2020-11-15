import { InjectionToken } from '@angular/core';
import { UohLogger } from '../services/uoh-logger.service';

export enum UohLogLevel {
  All = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
  Fatal = 5,
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
