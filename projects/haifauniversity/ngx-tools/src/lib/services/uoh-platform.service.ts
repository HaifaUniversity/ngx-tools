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
  /**
   * The default body width if undefined.
   */
  private readonly DEFAULT_BODY_WIDTH = {
    scrollWidth: -1,
    offsetWidth: -1,
  };
  /**
   * The default body height if undefined.
   */
  private readonly DEFAULT_BODY_HEIGHT = {
    scrollHeight: -1,
    offsetHeight: -1,
  };
  /**
   * The default html width if undefined.
   */
  private readonly DEFAULT_HTML_WIDTH = {
    clientWidth: -1,
    scrollWidth: -1,
    offsetWidth: -1,
  };
  /**
   * The default html height if undefined.
   */
  private readonly DEFAULT_HTML_HEIGHT = {
    clientHeight: -1,
    scrollHeight: -1,
    offsetHeight: -1,
  };

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
    const url = !!document ? document.URL : '';

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
   * Retrieves the document width.
   */
  getDocumentWidth(): number {
    if (!this.document) {
      return -1;
    }

    // Merge the default body and html screen size with the actual ones.
    // The defaults are used as a fallback if the body, the html or one of its parameters is undefined (thus Math.max won't crash).
    const body = { ...this.DEFAULT_BODY_WIDTH, ...this.document.body };
    const html = {
      ...this.DEFAULT_HTML_WIDTH,
      ...this.document.documentElement,
    };

    return Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
  }

  /**
   * Retrieves the document height.
   */
  getDocumentHeight(): number {
    if (!this.document) {
      return -1;
    }

    // Merge the default body and html screen size with the actual ones.
    // The defaults are used as a fallback if the body, the html or one of its parameters is undefined (thus Math.max won't crash).
    const body = { ...this.DEFAULT_BODY_HEIGHT, ...this.document.body };
    const html = {
      ...this.DEFAULT_HTML_HEIGHT,
      ...this.document.documentElement,
    };

    return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
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
