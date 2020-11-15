import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UohPlatform, WINDOW } from '../services/uoh-platform.service';

@NgModule({
  imports: [CommonModule],
  providers: [
    {
      provide: WINDOW,
      useValue: window,
    },
    {
      provide: UohPlatform,
      useClass: UohPlatform,
    },
  ],
})
export class UohPlatformModule {}
