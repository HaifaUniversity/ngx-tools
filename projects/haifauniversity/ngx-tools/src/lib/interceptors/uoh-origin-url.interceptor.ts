import { Observable } from 'rxjs';
import { Injectable, Injector, InjectionToken } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpClient } from '@angular/common/http';

export const UOH_ORIGIN_URL = new InjectionToken<string>('');

@Injectable()
export class UohOriginUrlInterceptor implements HttpInterceptor {
  static SHOULD_USE_ORIGIN_URL_HEADER = 'Uoh-Interceptor-Origin-Url-Should-Use-Origin-Url';
  
  /**
   * ApiInterceptor constructor
   * 
   * @param injector 
   */
  constructor (private injector: Injector) {}

  /**
   * Get injected ConfigurationService
   */
  get http () {
    return this.injector.get(HttpClient);
  }

  /**
   * Get injected origin url
   */
  get originUrl () {
    return this.injector.get(UOH_ORIGIN_URL);
  }

  /**
   * Intercept
   * @param request
   * @param next
   * @returns {Ovservable<any>}
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    let clone: HttpRequest<any>;
    const url = request.url;
    const headers = request.headers;
    const shouldUseOriginUrl = headers.get(UohOriginUrlInterceptor.SHOULD_USE_ORIGIN_URL_HEADER);
    const originURL = this.originUrl;

    if (shouldUseOriginUrl != 'false' && (url[0] === '/' ||  url[0] === '\\')) {
      clone = request.clone({ url: `${originURL}${request.url}` });
    } else {
      clone = request.clone();
    }

    return next.handle(clone);
  }
}