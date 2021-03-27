import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MessageListConfig, TagsService, UserService } from '../core';
import { Observable, of, Subject } from 'rxjs';
import { State } from '../core/services/State';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  tags: Array<string> = [];
  tagsLoaded = false;
  state$: Observable<State>;
  private destroyed$ = new Subject<void>();

  constructor(private router: Router, private tagsService: TagsService, private userService: UserService) {}

  ngOnInit() {
    this.state$ = this.userService.state$.pipe(
      takeUntil(this.destroyed$),
      switchMap((state) => {
        return state.tags
          ? of(state)
          : this.tagsService.getAll().pipe(
              map((tags) => ({ ...state, tags: tags })),
              catchError((err) => {
                console.error(err);
                this.tagsLoaded = true;
                return of({ ...state, tags: [] });
              })
            );
      })
    );
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  setListType(type: string) {
    this.userService.setListType(type);
  }

  setMessageListConfig(messageListConfig: MessageListConfig) {
    this.userService.setMessageListConfig(messageListConfig);
  }

  setTag(tag: string) {
    this.userService.setTag(tag);
  }
}
