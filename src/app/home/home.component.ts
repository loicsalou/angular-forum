import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TagsService, UserService } from '../core';
import { of, Subject } from 'rxjs';
import { State } from '../core/services/State';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  state: State;
  tags: Array<string> = [];
  tagsLoaded = false;
  private destroyed$ = new Subject<void>();

  constructor(private router: Router, private tagsService: TagsService, private userService: UserService) {}

  ngOnInit() {
    this.userService.state$
      .pipe(
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
      )
      .subscribe((state) => (this.state = state));
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  setListType(type: string) {
    this.setState({ ...this.state, currentFilters: { ...this.state.currentFilters, type: type } });
  }

  setState(state: State) {
    this.userService.setMessageListConfig(state);
  }

  setTag(tag: string) {
    this.setState({
      ...this.state,
      currentFilters: { ...this.state.currentFilters, filters: { ...this.state.currentFilters.filters, tag: tag } },
    });
  }
}
