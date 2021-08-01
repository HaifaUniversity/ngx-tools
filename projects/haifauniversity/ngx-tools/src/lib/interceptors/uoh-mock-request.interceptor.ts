import { Observable } from 'rxjs';
import { Injectable, InjectionToken, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpClient } from '@angular/common/http';

export const UOH_MOCK_REQUESTS = new InjectionToken<boolean>('');

@Injectable()
export class UohMockRequestInterceptor implements HttpInterceptor {
  static DUMMY_DATA_PATH_HEADER = 'Uoh-Interceptor-Mock-Request-Dummy-Data-Path';
  
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
   * Get injected ConfigurationService
   */
  shouldMockRequests () {
    return this.injector.get(UOH_MOCK_REQUESTS);
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
    const dummyDataPath = headers.get(UohMockRequestInterceptor.DUMMY_DATA_PATH_HEADER);

    if (!this.shouldMockRequests() || !dummyDataPath) {
      return next.handle(clone);
    }

    return next.handle(new HttpRequest(<any> request.method, dummyDataPath));
  }
}