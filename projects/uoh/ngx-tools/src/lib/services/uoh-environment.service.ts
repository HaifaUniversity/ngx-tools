import { Inject, Injectable } from '@angular/core';
import {
  UohEnvironment,
  UohEnvironmentURL,
  UOH_ENVIRONMENT,
} from '../models/environment.model';

@Injectable({
  providedIn: 'root',
})
export class UohEnvironmentService {
  constructor(@Inject(UOH_ENVIRONMENT) private environment: UohEnvironment) {}

  /**
   * Returns the url that corrensponds to the running environment.
   * @param url An object containing different urls for each environment.
   */
  getEnvironmentURL(url: UohEnvironmentURL): string {
    if (this.environment === UohEnvironment.Development) {
      return url.development;
    } else if (this.environment === UohEnvironment.QA) {
      return url.qa;
    } else {
      return url.production;
    }
  }

  /**
   * Returns the origin from the url, i.e.: 'https://payment.haifa.ac.il' from 'https://payment.haifa.ac.il/paymentService'.
   * @param url The payment url.
   */
  getOrigin(url: string): string {
    // Retrieve the position of the first slash that is not followed by another slash.
    const doubleSlash = url.indexOf('//');
    const firstSlash =
      doubleSlash > -1 ? url.indexOf('/', doubleSlash + 2) : url.indexOf('/');

    return firstSlash > -1 ? url.substring(0, firstSlash) : url;
  }
}
