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
