import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { UserService } from '../core';
import { map, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class HomeAuthResolver implements Resolve<boolean> {
  constructor(private router: Router, private userService: UserService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.userService.state$.pipe(
      take(1),
      map((state) => !!state.user)
    );
  }
}
