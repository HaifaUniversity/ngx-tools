import { NgModule } from '@angular/core';
import { UOH_ENVIRONMENT_FACTORY } from '../models/environment.model';
import { UohEnvironmentService } from '../services/uoh-environment.service';

@NgModule({
  declarations: [],
  imports: [],
  exports: [],
  providers: [UOH_ENVIRONMENT_FACTORY, UohEnvironmentService],
})
export class UohEnvironmentModule {}
