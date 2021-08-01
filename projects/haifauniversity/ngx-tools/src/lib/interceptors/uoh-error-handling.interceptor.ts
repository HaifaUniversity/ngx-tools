import { Observable, of } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { UohHttpErrorHandlerService } from '../services/uoh-http-error-handler.service';

@Injectable()
export class UohErrorHandlingInterceptor implements HttpInterceptor {
  static LABEL_HEADER = 'Uoh-Interceptor-Error-Handling-Label';
  static SHOULD_HANDLE_HEADER = 'Uoh-Interceptor-Error-Handler-Should-Handle';
  static DEFAULT_RESPONSE_HEADER = 'Uoh-Interceptor-Error-Handler-Default-Response';
  
  /**
   * ApiInterceptor constructor
   * 
   * @param injector 
   */
  constructor (private injector: Injector) {}

  /**
   * Get injected HttpErrorHandlerService
   */
  get errorHandler () {
    return this.injector.get(UohHttpErrorHandlerService);
  }

  /**
   * Intercept
   * @param request
   * @param next
   * @returns {Ovservable<any>}
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    let defualtResponse: object = {};
    const clone = request.clone();
    const headers = clone.headers;
    const label = headers.get(UohErrorHandlingInterceptor.LABEL_HEADER);
    const shouldHandle = headers.get(UohErrorHandlingInterceptor.SHOULD_HANDLE_HEADER);
    const defResParam = headers.get(UohErrorHandlingInterceptor.DEFAULT_RESPONSE_HEADER);

    if (defResParam?.length) {
      defualtResponse = JSON.parse(defResParam);
    }

    return (
      next.handle(clone)
      .pipe(
        timeout(10000),
        catchError(error => {
          if (shouldHandle === 'true') {
            return this.errorHandler.handle<any>(error, defualtResponse, label);
          }

          return of(error);
        })
      )
    );
  }
}