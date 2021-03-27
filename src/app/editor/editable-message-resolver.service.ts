import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';

import { Message, MessagesService, UserService } from '../core';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class EditableMessageResolver implements Resolve<Message> {
  constructor(private messagesService: MessagesService, private router: Router, private userService: UserService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return combineLatest([this.userService.state$, this.messagesService.get(route.params['slug'])]).pipe(
      map(([state, message]) => {
        if (state.user?.username === message.author.username) {
          return message;
        } else {
          this.router.navigateByUrl('/');
        }
      }),
      catchError((err) => this.router.navigateByUrl('/'))
    );
  }
}
