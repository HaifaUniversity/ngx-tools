import { Observable } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpClient } from '@angular/common/http';
import { UohLogger } from '../services/uoh-logger.service';

@Injectable()
export class UohLogRequestsInterceptor implements HttpInterceptor {
  static SHOULD_LOG_REQUEST_HEADER = 'Uoh-Interceptor-Log-Requests-Should-Log-Reqeust';
  
  /**
   * ApiInterceptor constructor
   * 
   * @param injector 
   */
  constructor (private injector: Injector) {}

  /**
   * Get injected HttpClient
   */
  get http (): HttpClient{
    return this.injector.get(HttpClient);
  }

  /**
   * Get injected UohLogger
   */
  get logger (): UohLogger {
    return this.injector.get(UohLogger);
  }

  /**
   * 
   * @param request
   * @param next
   * @returns {Ovservable<any>}
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const clone = request.clone();
    const headers = clone.headers;
    const shouldLog = headers.get(UohLogRequestsInterceptor.SHOULD_LOG_REQUEST_HEADER);

    if (shouldLog) {
      this.logger.debug('[LogRequestsInterceptors.intercept] request: ', clone.urlWithParams, ', body: ', JSON.stringify(clone.body));
    }

    return next.handle(clone);
  }
}