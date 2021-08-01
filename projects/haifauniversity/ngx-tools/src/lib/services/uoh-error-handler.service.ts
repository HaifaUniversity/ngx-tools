import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

export interface Error {
  message: string;
  label: string | null;
}

/**
 * Handles http errors and displays them into the app-error component.
 */
@Injectable({ providedIn: 'root' })
export class UohErrorHandlerService {
  private initialState: Error = { label: null, message: '' };
  private state = new BehaviorSubject<Error>(this.initialState);
  readonly state$ = this.state.asObservable();

  constructor() {}

  /**
   * Handles an http error, displays the error message and returns an Observable of the given output object (for the Observable catchError).
   * @param error The http error.
   * @param output The object to return after the error is handled.
   * @param label The error label for the display.
   */
  handle(label: Error['label'] = null, message: string = '') {
    this.set(message, label);
  }

  /**
   * Sets an error message to be displayed in the app-error component with given label.
   * @param message The error message.
   * @param label The error label for the display.
   */
  set(message: string, label: Error['label'] = null): void {
    this.state.next({ message, label });
  }

  /**
   * Retrieves the error message stored under the given label.
   * @param label The error label for the display.
   */
  select(label: Error['label'] = null): Observable<string> {
    return this.state$.pipe(
      filter((state) => !label || state.label === label),
      map((state) => state.message)
    );
  }

  /**
   * Clears the error messages under the given label.
   * @param label The error label for the display.
   */
  clear(label: Error['label'] = null): void {
    this.state.next({ ...this.initialState, label });
  }

  /**
   * Returns true if any error messages were registered, false otherwise.
   */
  hasErrors(): boolean {
    return !!this.state.getValue();
  }
}
