import { Inject, Injectable, InjectionToken } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  Platform,
  getSupportedInputTypes,
  supportsPassiveEventListeners,
  supportsScrollBehavior,
  getRtlScrollAxisType,
} from '@angular/cdk/platform';

/**
 * Provides the browser's window object.
 */
export const WINDOW = new InjectionToken<Window>('The window this app is running on.');

/**
 * Retrieves information about the platform running this app.
 */
// The following comment (dynamic) avoids Window type errors on "strictMetadataEmit": true
/** @dynamic */
@Injectable()
export class UohPlatform {
  constructor(
    private platform: Platform,
    @Inject(WINDOW) private window: Window,
    @Inject(DOCUMENT) private document: Document
  ) {}

  /**
   * Retrieves textual information about the client platform.
   */
  getInfo(): string {
    const supportedInputTypes = this.getSupportedInputTypes();
    const passiveEventListeners = supportsPassiveEventListeners();
    const scrollBehavior = supportsScrollBehavior();
    const rtlScrollAxisType = getRtlScrollAxisType();
    const windowScreen = this.getWindowScreenInfo();
    const documentScreen = this.getDocumentScreenInfo();
    const browser = this.getBrowserInfo();
    const url = !!this.document ? this.document.URL : '';

    const info =
      'Platform Information:' +
      ` URL: ${url},` +
      ` Browser: ${this.platform.isBrowser},` +
      ` Android: ${this.platform.ANDROID},` +
      ` iOS: ${this.platform.IOS},` +
      ` Firefox: ${this.platform.FIREFOX},` +
      ` Blink: ${this.platform.BLINK},` +
      ` Webkit: ${this.platform.WEBKIT},` +
      ` Trident: ${this.platform.TRIDENT},` +
      ` Edge: ${this.platform.EDGE},` +
      ` Safari: ${this.platform.SAFARI},` +
      ` Supported input types: ${supportedInputTypes},` +
      ` Supports passive event listeners: ${passiveEventListeners},` +
      ` Supports scroll behavior: ${scrollBehavior},` +
      ` RTL scroll axis type: ${rtlScrollAxisType},` +
      ` ${windowScreen},` +
      ` ${documentScreen},` +
      ` ${browser}`;

    return info;
  }

  /**
   * Retrieves the document width or -1 if undefined.
   */
  getDocumentWidth(): number {
    if (!this.document) {
      return -1;
    }

    // Get the max width between the body and the document element.
    const body = this.getMaxWidth(this.document.body);
    const html = this.getMaxWidth(this.document.documentElement);

    return Math.max(body, html);
  }

  /**
   * Retrieves the document height or -1 if undefined.
   */
  getDocumentHeight(): number {
    if (!this.document) {
      return -1;
    }

    // Get the max height between the body and the document element.
    const body = this.getMaxHeight(this.document.body);
    const html = this.getMaxHeight(this.document.documentElement);

    return Math.max(body, html);
  }

  /**
   * Returns the maximum width for the given element (from scroll, offset and client widths).
   * @param element The HTML element.
   * @returns The maximum width for the given element or -1 if undefined.
   */
  private getMaxWidth(element: HTMLElement): number {
    if (!element) {
      return -1;
    }

    const scrollWidth = !!element.scrollWidth ? element.scrollWidth : -1;
    const offsetWidth = !!element.offsetWidth ? element.offsetWidth : -1;
    const clientWidth = !!element.clientWidth ? element.clientWidth : -1;

    return Math.max(scrollWidth, offsetWidth, clientWidth);
  }

  /**
   * Returns the maximum height for the given element (from scroll, offset and client heights).
   * @param element The HTML element.
   * @returns The maximum height for the given element or -1 if undefined.
   */
  private getMaxHeight(element: HTMLElement): number {
    if (!element) {
      return -1;
    }

    const scrollHeight = !!element.scrollHeight ? element.scrollHeight : -1;
    const offsetHeight = !!element.offsetHeight ? element.offsetHeight : -1;
    const clientHeight = !!element.clientHeight ? element.clientHeight : -1;

    return Math.max(scrollHeight, offsetHeight, clientHeight);
  }

  /**
   * Retrieves textual information about the document width and height.
   */
  private getDocumentScreenInfo(): string {
    if (!this.document) {
      return '';
    }

    const width = this.getDocumentWidth();
    const height = this.getDocumentHeight();

    return `Document width: ${width}, Document height: ${height}`;
  }

  /**
   * Retrieves the window screen information.
   */
  private getWindowScreenInfo(): string {
    if (!this.window) {
      return '';
    }

    const basic = `Inner width: ${this.window.innerWidth}, Inner height: ${this.window.innerHeight}`;

    return !!this.window.screen
      ? `Width: ${this.window.screen.width},` +
          ` Height: ${this.window.screen.height},` +
          ` Available width: ${this.window.screen.availWidth},` +
          ` Available height: ${this.window.screen.availHeight},` +
          ` ${basic}`
      : basic;
  }

  /**
   * Retrieves the browser details.
   */
  private getBrowserInfo(): string {
    if (!this.window) {
      return '';
    }

    return `Browser Vendor: ${this.window.navigator.vendor}, User Agent: ${this.window.navigator.userAgent}, Platform: ${this.window.navigator.platform}`;
  }

  /**
   * Retrieves the list of supported input types by the browser.
   */
  private getSupportedInputTypes(): string {
    return Array.from(getSupportedInputTypes()).join(', ');
  }
}
