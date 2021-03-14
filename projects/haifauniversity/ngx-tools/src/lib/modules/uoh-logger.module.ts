import { ModuleWithProviders, NgModule } from '@angular/core';
import { UohLogLevel } from '../models/log.model';
import { UohLogger, UOH_LOGGER_LEVEL, UOH_LOGGER_URL } from '../services/uoh-logger.service';

@NgModule()
export class UohLoggerModule {
  /**
   * Configures the UohLoggerModule.
   * @param url The url to send the logs to.
   * @param level The log level for the client.
   * @param useClass The class to use as logger. You can extend the UohLogger and use your own.
   * @returns The UohLoggerModule with the providers.
   */
  static forRoot(url: string, level?: UohLogLevel, useClass = UohLogger): ModuleWithProviders<UohLoggerModule> {
    return {
      ngModule: UohLoggerModule,
      providers: [
        {
          provide: UOH_LOGGER_URL,
          useValue: url,
        },
        {
          provide: UOH_LOGGER_LEVEL,
          useValue: level,
        },
        {
          provide: UohLogger,
          useClass,
        },
      ],
    };
  }
}
