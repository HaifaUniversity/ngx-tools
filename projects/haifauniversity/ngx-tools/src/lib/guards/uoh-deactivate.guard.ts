import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UohDeactivableComponent } from '../models/deactivable.model';

@Injectable({
  providedIn: 'root',
})
export class UohDeactivateGuard
  implements CanDeactivate<UohDeactivableComponent> {
  /**
   * Checks if a component that implements the deactivable interface can be deactivated.
   * @param component The deactivable component.
   * @param currentRoute The current route.
   * @param currentState The current router state.
   * @param nextState The next router state.
   */
  canDeactivate(
    component: UohDeactivableComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // The deactivation logic resides in the component itself.
    return component.canDeactivate();
  }
}
