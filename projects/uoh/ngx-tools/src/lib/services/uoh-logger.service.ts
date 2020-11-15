import { Inject, Injectable, NgZone } from '@angular/core';

import {
  UohLog,
  UohLogLevel,
  UOH_LOGGER_LEVEL,
  UOH_LOGGER_URL,
} from '../models/log.model';

/**
 * Logs values to a backend service.
 */
@Injectable()
export class UohLogger {
  constructor(
    private ngZone: NgZone,
    @Inject(UOH_LOGGER_URL) private readonly URL: string,
    @Inject(UOH_LOGGER_LEVEL) private level: UohLogLevel
  ) {
    this.level = !!level ? level : UohLogLevel.Info;
  }

  /**
   * Logs values in the all level.
   * @param values The comma separated values.
   */
  all(...values: Array<string>): void {
    this.log(UohLogLevel.All, true, ...values);
  }

  /**
   * Logs values in the debug level.
   * @param values The comma separated values.
   */
  debug(...values: Array<string>): void {
    this.log(UohLogLevel.Debug, true, ...values);
  }

  /**
   * Logs values in the info level.
   * @param values The comma separated values.
   */
  info(...values: Array<string>): void {
    this.log(UohLogLevel.Info, true, ...values);
  }

  /**
   * Logs values in the warn level.
   * @param values The comma separated values.
   */
  warn(...values: Array<string>): void {
    this.log(UohLogLevel.Warn, true, ...values);
  }

  /**
   * Logs values in the error level.
   * @param values The comma separated values.
   */
  error(...values: Array<string>): void {
    this.log(UohLogLevel.Error, true, ...values);
  }

  /**
   * Logs values in the fatal level.
   * @param values The comma separated values.
   */
  fatal(...values: Array<string>): void {
    this.log(UohLogLevel.Fatal, true, ...values);
  }

  /**
   * Prints the given values to log.
   * @param level The log level.
   * @param async Whether to perform an async (true) or sync (false) xhr request.
   * @param values The values to log.
   */
  log(level: UohLogLevel, async: boolean, ...values: Array<string>): void {
    // Send the log request only if the level is greater or equal to the level configured in the module.
    if (level >= this.level) {
      // Get the name of the key in the log level enum to send it in the request.
      const levelName = UohLogLevel[level] as string;
      const message = this.concatenate(values);
      const log: UohLog = {
        level: levelName.toUpperCase(),
        message,
      };

      this.post(this.URL, JSON.stringify(log), async);
    }
  }

  private post(url: string, content: string, async = true): void {
    this.ngZone.runOutsideAngular(() => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, async);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(content);
    });
  }

  /**
   * Concatenates an array of string values.
   * @param values The array of values.
   */
  private concatenate(values: Array<string>): string {
    return values.join(' ');
  }
}
