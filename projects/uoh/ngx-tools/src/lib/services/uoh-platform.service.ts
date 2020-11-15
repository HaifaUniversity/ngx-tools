import { Inject, Injectable, InjectionToken } from '@angular/core';
import {
  Platform,
  getSupportedInputTypes,
  supportsPassiveEventListeners,
  supportsScrollBehavior,
  getRtlScrollAxisType,
} from '@angular/cdk/platform';
import { WINDOW } from '../models/window.model';

@Injectable()
export class UohPlatform {
  constructor(
    private platform: Platform,
    @Inject(WINDOW) private window: Window
  ) {}

  /**
   * Retrieves textual information about the client platform.
   */
  getInfo(): string {
    const supportedInputTypes = this.getSupportedInputTypes();
    const passiveEventListeners = supportsPassiveEventListeners();
    const scrollBehavior = supportsScrollBehavior();
    const rtlScrollAxisType = getRtlScrollAxisType();
    const screen = this.getScreenInfo();
    const browser = this.getBrowserInfo();

    const info = `Platform Information:
      Browser: ${this.platform.isBrowser},
      Android: ${this.platform.ANDROID},
      iOS: ${this.platform.IOS},
      Firefox: ${this.platform.FIREFOX},
      Blink: ${this.platform.BLINK},
      Webkit: ${this.platform.WEBKIT},
      Trident: ${this.platform.TRIDENT},
      Edge: ${this.platform.EDGE},
      Safari: ${this.platform.SAFARI},
      Supported input types: ${supportedInputTypes},
      Supports passive event listeners: ${passiveEventListeners},
      Supports scroll behavior: ${scrollBehavior},
      RTL scroll axis type: ${rtlScrollAxisType},
      ${screen},
      ${browser}`;

    return info;
  }

  /**
   * Retrieves the screen information.
   */
  private getScreenInfo(): string {
    if (!this.window) {
      return '';
    }

    const basic = `Inner width: ${this.window.innerWidth},
      Inner height: ${this.window.innerHeight}`;

    return !!this.window.screen
      ? `Width: ${this.window.screen.width},
      Height: ${this.window.screen.height},
      Available width: ${this.window.screen.availWidth},
      Available height: ${this.window.screen.availHeight},
      ${basic}`
      : basic;
  }

  /**
   * Retrieves the browser details.
   */
  private getBrowserInfo(): string {
    if (!this.window) {
      return '';
    }

    return `Browser Vendor: ${this.window.navigator.vendor},
        User Agent: ${this.window.navigator.userAgent},
        Platform: ${this.window.navigator.platform}`;
  }

  /**
   * Retrieves the list of supported input types by the browser.
   */
  private getSupportedInputTypes(): string {
    return Array.from(getSupportedInputTypes()).join(', ');
  }
}
