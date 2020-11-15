import { CommonModule, DOCUMENT } from '@angular/common';
import { FactoryProvider, InjectionToken, NgModule } from '@angular/core';
import { UohEnvironment } from '../models/environment.model';

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

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [],
  providers: [UOH_ENVIRONMENT_FACTORY],
})
export class UohEnvironmentModule {}
