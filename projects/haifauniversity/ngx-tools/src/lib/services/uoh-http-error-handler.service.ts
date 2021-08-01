import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { UohLogger } from './uoh-logger.service';
import { Error, UohErrorHandlerService } from './uoh-error-handler.service';

export enum ErrorType {
  GENERAL_ERROR = 'GENERAL_ERROR',
  INPUT_ERROR = 'INPUT_ERROR',
  OUTPUT_ERROR = 'OUTPUT_ERROR'
}

export interface GeneralError {
  message: string;
}

export interface ValidationError extends GeneralError {
  validation: boolean;
  field: string;
  value: string;
  validator: string;
}

export interface BapiError extends GeneralError {
  bapi: boolean;
  number: number;
}

export type ApiError = GeneralError | ValidationError | BapiError | {};

/**
 * Handles http errors and displays them into the app-error component.
 */
@Injectable({ providedIn: 'root' })
export class UohHttpErrorHandlerService {

  constructor(private logger: UohLogger, private errorHandler: UohErrorHandlerService) {}

  /**
   * Handles an http error, displays the error message and returns an Observable of the given output object (for the Observable catchError).
   * @param error The http error.
   * @param output The object to return after the error is handled.
   * @param label The error label for the display.
   */
  handle<T>(error: HttpErrorResponse, output: T, label: Error['label'] = null, message: Error['message'] = ''): Observable<T> {
    const [ errorMessage, params ] = this.parseMessage(error);

    this.errorHandler.handle(label, message || errorMessage);
    console.error('[ErrorHandlerService.handle] Label: ', label || 'null', 'message: ', errorMessage, 'params: ', JSON.stringify(params));
    this.logger.error('[ErrorHandlerService.handle] Label: ', label || 'null', 'message: ', errorMessage, 'params: ', JSON.stringify(params));
    
    return of(output);
  }

  /**
   * Retrieves the error message returned by the server (it may return a json object).
   * @param error The http error.
   */
  parseMessage(error: HttpErrorResponse): [ string, ApiError ] {
    let message = ErrorType.GENERAL_ERROR;

    try {
      // Try to get the error as a json object.
      if (error.error) {
        let apiError = error.error;

        if (apiError.validation === true) {
          apiError = apiError as ValidationError;
          message = ErrorType.INPUT_ERROR;
        } else if (apiError.bapi) {
          apiError = apiError as BapiError;
          message = apiError.message;
        } else {
          apiError = apiError as GeneralError;
        }

        return [ message, apiError ];
      }
    } catch (e) {}

    // The error message is plain text
    return [ message, error ];
  }

  /**
   * Retrieves the error message stored under the given label.
   * @param label The error label for the display.
   */
  select(label?: string): Observable<string> {
    return this.errorHandler.select(label);
  }

  /**
   * Clears the error messages under the given label.
   * @param label The error label for the display.
   */
  clear(label: Error['label'] = null): void {
    return this.errorHandler.clear(label);
  }

  /**
   * Returns true if any error messages were registered, false otherwise.
   */
  hasErrors(): boolean {
    return this.errorHandler.hasErrors();
  }
}
