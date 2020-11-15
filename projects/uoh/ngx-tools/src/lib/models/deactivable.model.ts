import { UrlTree } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';

export interface UohDeactivableComponent {
  canDeactivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree;
}
