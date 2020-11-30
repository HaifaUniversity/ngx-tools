import { Inject, Injectable, InjectionToken, NgZone } from '@angular/core';

import { UohLog, UohLogLevel } from '../models/log.model';
import { UohLoggerId } from './uoh-logger-id.service';

/**
 * Provides the url for the logger.
 */
export const UOH_LOGGER_URL = new InjectionToken<string>('The url were to send the UohLogger requests.');

/**
 * Provides the log level for the logger.
 */
export const UOH_LOGGER_LEVEL = new InjectionToken<string>('The log level for the UohLogger.');

/**
 * Logs values to a backend service.
 */
@Injectable()
export class UohLogger {
  constructor(
    private ngZone: NgZone,
    @Inject(UOH_LOGGER_URL) private readonly URL: string,
    @Inject(UOH_LOGGER_LEVEL) private level: UohLogLevel,
    private id: UohLoggerId
  ) {
    this.level = !!level ? level : UohLogLevel.INFO;
  }

  /**
   * Logs values in the all level.
   * @param values The comma separated values.
   */
  all(...values: Array<string>): void {
    this.log(UohLogLevel.ALL, true, ...values);
  }

  /**
   * Logs values in the debug level.
   * @param values The comma separated values.
   */
  debug(...values: Array<string>): void {
    this.log(UohLogLevel.DEBUG, true, ...values);
  }

  /**
   * Logs values in the info level.
   * @param values The comma separated values.
   */
  info(...values: Array<string>): void {
    this.log(UohLogLevel.INFO, true, ...values);
  }

  /**
   * Logs values in the warn level.
   * @param values The comma separated values.
   */
  warn(...values: Array<string>): void {
    this.log(UohLogLevel.WARN, true, ...values);
  }

  /**
   * Logs values in the error level.
   * @param values The comma separated values.
   */
  error(...values: Array<string>): void {
    this.log(UohLogLevel.ERROR, true, ...values);
  }

  /**
   * Logs values in the fatal level.
   * @param values The comma separated values.
   */
  fatal(...values: Array<string>): void {
    this.log(UohLogLevel.FATAL, true, ...values);
  }

  /**
   * Prints the given values to log.
   * @param level The log level.
   * @param async Whether to perform an async (true) or sync (false) xhr request.
   * @param values The values to log.
   */
  log(level: UohLogLevel, async: boolean, ...values: Array<string>): void {
    // Send the log request only if the level is greater or equal to the level configured in the module.
    if (level <= this.level) {
      // Get the name of the key in the log level enum to send it in the request.
      const levelName = UohLogLevel[level] as string;
      const message = this.concatenate(values);
      const log: UohLog = {
        level: levelName,
        message,
      };

      this.post(this.URL, JSON.stringify(log), async);
    }
  }

  /**
   * Posts the given content to the given url.
   * @param url The url to post to.
   * @param content The content to post.
   * @param async Whether to send an async or sync request.
   */
  private post(url: string, content: string, async = true): void {
    this.ngZone.runOutsideAngular(() => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, async);
      xhr.setRequestHeader('Content-Type', 'application/json');
      if (!!this.id.get()) {
        xhr.setRequestHeader(UohLoggerId.HEADER_KEY, this.id.get());
      }
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
