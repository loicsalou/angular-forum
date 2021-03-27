import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Router } from '@angular/router';

import { Profile, ProfilesService, UserService } from '../../core';
import { concatMap, map, takeUntil, tap } from 'rxjs/operators';
import { of, Subject } from 'rxjs';

@Component({
  selector: 'app-follow-button',
  templateUrl: './follow-button.component.html',
})
export class FollowButtonComponent implements OnDestroy {
  @Input() profile: Profile;
  @Output() toggle = new EventEmitter<boolean>();
  isSubmitting = false;
  private destroyed$ = new Subject<void>();

  constructor(private profilesService: ProfilesService, private router: Router, private userService: UserService) {}

  toggleFollowing() {
    this.isSubmitting = true;
    // TODO: remove nested subscribes, use mergeMap

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

          // Follow this profile if we aren't already
          if (!this.profile.following) {
            return this.profilesService.follow(this.profile.username).pipe(
              tap(
                (data) => {
                  this.isSubmitting = false;
                  this.toggle.emit(true);
                },
                (err) => (this.isSubmitting = false)
              )
            );

            // Otherwise, unfollow this profile
          } else {
            return this.profilesService.unfollow(this.profile.username).pipe(
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
