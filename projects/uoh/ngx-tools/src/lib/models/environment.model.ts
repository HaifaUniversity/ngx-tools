import { DOCUMENT } from '@angular/common';
import { FactoryProvider, InjectionToken } from '@angular/core';

/**
 * Represents the different running environments.
 */
export enum UohEnvironment {
  Development = 'dev',
  QA = 'qa',
  Production = '',
}

/**
 * Stores a different url for each environment.
 */
export interface UohEnvironmentURL {
  development: string;
  qa: string;
  production: string;
}

/**
 * Retrieves the environment the app is currently running on.
 * @param document The HTML document.
 */
export function getEnvironment(document: Document): UohEnvironment {
  if (document.location.hostname.includes(UohEnvironment.Development)) {
    return UohEnvironment.Development;
  } else if (document.location.hostname.includes(UohEnvironment.QA)) {
    return UohEnvironment.QA;
  } else {
    return UohEnvironment.Production;
  }
}

/**
 * A token to inject the running environment.
 */
export const UOH_ENVIRONMENT = new InjectionToken<UohEnvironment>(
  'The environment this app is running on.'
);

/**
 * A factory that injects the running environment.
 */
export const UOH_ENVIRONMENT_FACTORY: FactoryProvider = {
  provide: UOH_ENVIRONMENT,
  useFactory: getEnvironment,
  deps: [DOCUMENT],
};
