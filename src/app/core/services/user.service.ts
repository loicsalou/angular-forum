import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { ApiService } from './api.service';
import { MessageListConfig, User } from '../models';
import { catchError, map, tap } from 'rxjs/operators';
import { State } from './State';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService implements OnDestroy {
  currentState: State = {
    user: null,
    currentFilters: {
      type: 'all',
      filters: {},
    },
  };
  state$ = new BehaviorSubject(this.currentState);

  constructor(private apiService: ApiService) {}

  ngOnDestroy() {
    this.state$.complete();
  }

  setMessageListConfig(messageListConfig: MessageListConfig): void {
    this.currentState = { ...this.currentState, currentFilters: messageListConfig };
    this.state$.next(this.currentState);
  }

  checkAuth(): Observable<User | null> {
    // vérifie le statut d'authentification dans cavus
    return this.apiService.get('/logged-user').pipe(
      map((data) => data.user),
      // TODO pas de username retourné par le REST de Manu. Voir si on peut récupérer ça
      // TODO attention le username est aussi utilisé ailleurs pour matcher avec l'auteur d'un message
      tap((user) => this.setUser({ ...user, username: user.login })),
      catchError((err) => {
        this.redirectToCavusLogin();
        return of(null);
      })
    );
  }

  handleNotAuth() {
    confirm('authentification requise').valueOf();
    this.redirectToCavusLogin();
  }

  setListType(type: string) {
    this.currentState = {
      ...this.currentState,
      currentFilters: {
        ...this.currentState.currentFilters,
        filters: {
          ...this.currentState.currentFilters.filters,
          author: this.currentState.user.login,
        },
        type: type,
      },
    };
    if (type != 'feed') {
      delete this.currentState.currentFilters.filters.author;
    }
    this.state$.next(this.currentState);
  }

  setTag(tag: string) {
    this.currentState = {
      ...this.currentState,
      currentFilters: {
        ...this.currentState.currentFilters,
        filters: { ...this.currentState.currentFilters.filters },
      },
    };
    if (tag === this.currentState.currentFilters.filters.tag) {
      delete this.currentState.currentFilters.filters.tag;
    } else {
      this.currentState.currentFilters.filters.tag = tag;
    }
    this.state$.next(this.currentState);
  }

  private redirectToCavusLogin() {
    window.location.href = environment.cavus_url;
  }

  private setUser(user: User) {
    this.currentState = { ...this.currentState, user: user };
    this.state$.next(this.currentState);
  }
}
