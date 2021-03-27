import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Router } from '@angular/router';

import { Message, MessagesService, UserService } from '../../core';
import { of, Subject } from 'rxjs';
import { concatMap, map, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-favorite-button',
  templateUrl: './favorite-button.component.html',
})
export class FavoriteButtonComponent implements OnDestroy {
  @Input() message: Message;
  @Output() toggle = new EventEmitter<boolean>();
  isSubmitting = false;
  private destroyed$ = new Subject<void>();

  constructor(private messagesService: MessagesService, private router: Router, private userService: UserService) {}

  toggleFavorite() {
    this.isSubmitting = true;

    this.userService.state$
      .pipe(
        takeUntil(this.destroyed$),
        map((state) => !!state.user),
        concatMap((authenticated) => {
          // Not authenticated? Push to login screen
          if (!authenticated) {
            this.userService.handleNotAuth();
            return of(null);
          }

          // Favorite the message if it isn't favorited yet
          if (!this.message.favorited) {
            return this.messagesService.favorite(this.message.slug).pipe(
              tap(
                (data) => {
                  this.isSubmitting = false;
                  this.toggle.emit(true);
                },
                (err) => (this.isSubmitting = false)
              )
            );

            // Otherwise, unfavorite the message
          } else {
            return this.messagesService.unfavorite(this.message.slug).pipe(
              tap(
                (data) => {
                  this.isSubmitting = false;
                  this.toggle.emit(false);
                },
                (err) => (this.isSubmitting = false)
              )
            );
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
