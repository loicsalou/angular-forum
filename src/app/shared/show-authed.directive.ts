import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

import { UserService } from '../core';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Directive({ selector: '[appShowAuthed]' })
export class ShowAuthedDirective implements OnInit, OnDestroy {
  condition: boolean;
  private destroyed$ = new Subject<void>();

  constructor(
    private templateRef: TemplateRef<any>,
    private userService: UserService,
    private viewContainer: ViewContainerRef
  ) {}

  @Input() set appShowAuthed(condition: boolean) {
    this.condition = condition;
  }

  ngOnInit() {
    this.userService.state$
      .pipe(
        takeUntil(this.destroyed$),
        map((state) => !!state.user)
      )
      .subscribe((isAuthenticated) => {
        if ((isAuthenticated && this.condition) || (!isAuthenticated && !this.condition)) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
