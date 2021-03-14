import { Inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';

import { UohLog, UohLogLevel } from '../models/log.model';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

/**
 * Provides the url for the logger.
 */
export const UOH_LOGGER_URL = new InjectionToken<string>('The url were to send the UohLogger requests.');

/**
 * Provides the log level for the logger.
 */
export const UOH_LOGGER_LEVEL = new InjectionToken<string>('The log level for the UohLogger.');

/**
 * A header used to mark the requests sent by the UohLogger.
 */
export const UOH_LOGGER_HEADER = 'uoh-logger';

/**
 * Checks if a HTTP request was sent by the UohLogger (useful for interceptors).
 * @param request The HTTP request.
 * @returns True if the request was sent by the UohLogger, false otherwise.
 */
export const isUohLogger = (request: HttpRequest<any>) => !!request.headers && !!request.headers.get(UOH_LOGGER_HEADER);

/**
 * Logs values to a backend service.
 */
@Injectable()
export class UohLogger implements OnDestroy {
  private subscription = new Subscription();

  constructor(
    private http: HttpClient,
    @Inject(UOH_LOGGER_URL) private readonly URL: string,
    @Inject(UOH_LOGGER_LEVEL) private level: UohLogLevel
  ) {
    this.level = !!level ? level : UohLogLevel.INFO;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Logs values in the all level.
   * @param values The comma separated values.
   */
  all(...values: Array<string>): void {
    this.log(UohLogLevel.ALL, ...values);
  }

  /**
   * Logs values in the debug level.
   * @param values The comma separated values.
   */
  debug(...values: Array<string>): void {
    this.log(UohLogLevel.DEBUG, ...values);
  }

  /**
   * Logs values in the info level.
   * @param values The comma separated values.
   */
  info(...values: Array<string>): void {
    this.log(UohLogLevel.INFO, ...values);
  }

  /**
   * Logs values in the warn level.
   * @param values The comma separated values.
   */
  warn(...values: Array<string>): void {
    this.log(UohLogLevel.WARN, ...values);
  }

  /**
   * Logs values in the error level.
   * @param values The comma separated values.
   */
  error(...values: Array<string>): void {
    this.log(UohLogLevel.ERROR, ...values);
  }

  /**
   * Logs values in the fatal level.
   * @param values The comma separated values.
   */
  fatal(...values: Array<string>): void {
    this.log(UohLogLevel.FATAL, ...values);
  }

  /**
   * Prints the given values to log.
   * @param level The log level.
   * @param values The values to log.
   */
  log(level: UohLogLevel, ...values: Array<string>): void {
    // Send the log request only if the level is greater or equal to the level configured in the module.
    if (level <= this.level) {
      // Get the name of the key in the log level enum to send it in the request.
      const levelName = UohLogLevel[level] as string;
      const message = this.concatenate(values);
      const log: UohLog = {
        level: levelName,
        message,
      };

      this.post(this.URL, JSON.stringify(log));
    }
  }

  /**
   * Posts the given content to the given url.
   * @param url The url to post to.
   * @param content The content to post.
   */
  private post(url: string, content: string): void {
    const headers = new HttpHeaders().set(UOH_LOGGER_HEADER, 'true');

    this.subscription.add(this.http.post(url, content, { headers }).pipe(take(1)).subscribe());
  }

  /**
   * Concatenates an array of string values.
   * @param values The array of values.
   */
  private concatenate(values: Array<string>): string {
    return values.join(' ');
  }
}
