import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { User, UserService, Profile } from '../core';
import { concatMap, tap } from 'rxjs/operators';
import { State } from '../core/services/state';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  constructor(private route: ActivatedRoute, private userService: UserService) {}

  profile: Profile;
  currentUser: User;
  isUser: boolean;

  ngOnInit() {
    this.route.data
      .pipe(
        concatMap((data: { profile: Profile }) => {
          this.profile = data.profile;
          // Load the current user's data.
          return this.userService.state$.pipe(
            tap((state: State) => {
              this.currentUser = state.user;
              this.isUser = this.currentUser.username === this.profile.username;
            })
          );
        })
      )
      .subscribe();
  }

  onToggleFollowing(following: boolean) {
    this.profile.following = following;
  }
}
