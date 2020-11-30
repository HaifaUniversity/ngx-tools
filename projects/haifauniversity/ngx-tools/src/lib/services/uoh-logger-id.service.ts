import { Injectable } from '@angular/core';

/**
 * Provides an ID to be sent in the header of the logger requests (usually the user ID).
 */
@Injectable({ providedIn: 'root' })
export class UohLoggerId {
  /**
   * The key for the header.
   */
  static readonly HEADER_KEY = 'uoh-logger-id';
  /**
   * The value for the header.
   */
  private id: string;

  /**
   * Sets the ID.
   * @param id The ID.
   */
  set(id: string): void {
    this.id = id;
  }

  /**
   * Retrieves the current stored ID.
   */
  get(): string {
    return this.id;
  }

  /**
   * Clears the current stored ID.
   */
  clear(): void {
    this.id = undefined;
  }
}
