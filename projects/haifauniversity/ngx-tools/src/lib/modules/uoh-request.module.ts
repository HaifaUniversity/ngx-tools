import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { UohErrorHandlingInterceptor } from '../interceptors/uoh-error-handling.interceptor';
import { UohLogRequestsInterceptor } from '../interceptors/uoh-log-request.interceptor';
import { UohMockRequestInterceptor, UOH_MOCK_REQUESTS } from '../interceptors/uoh-mock-request.interceptor';
import { UohOriginUrlInterceptor, UOH_ORIGIN_URL } from '../interceptors/uoh-origin-url.interceptor';
import { UohRequestOptions } from '../models/request.model';

export const UOH_REQUEST_DEFAULT_OPTIONS: UohRequestOptions = {
  originUrl: '',
  mockRequests: false
};

@NgModule()
export class UohRequestModule {
  /**
   * Configures UohRequestModule and provide request interceptors
   * @param overrides Override request module options
   * @returns UohRequestModule with necessary providers
   */
  static forRoot(overrides: Partial<UohRequestOptions> = {}): ModuleWithProviders<UohRequestModule> {
    const options = { ...UOH_REQUEST_DEFAULT_OPTIONS, ...overrides };

    return {
      ngModule: UohRequestModule,
      providers: [
        {
          provide: UOH_ORIGIN_URL,
          useValue: options.originUrl,
        },
        {
          provide: UOH_MOCK_REQUESTS,
          useValue: options.mockRequests,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: UohOriginUrlInterceptor,
          multi: true
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: UohMockRequestInterceptor,
          multi: true
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: UohLogRequestsInterceptor,
          multi: true
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: UohErrorHandlingInterceptor,
          multi: true
        },
      ],
    };
  }
}
