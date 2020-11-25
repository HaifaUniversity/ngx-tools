import { ModuleWithProviders, NgModule } from '@angular/core';
import { UohLogLevel } from '../models/log.model';
import { UohLogger, UOH_LOGGER_LEVEL, UOH_LOGGER_URL } from '../services/uoh-logger.service';

@NgModule()
export class UohLoggerModule {
  static forRoot(url: string, level?: UohLogLevel): ModuleWithProviders<UohLoggerModule> {
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
          useClass: UohLogger,
        },
      ],
    };
  }
}
