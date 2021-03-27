import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';

import { ApiService } from './api.service';
import { MessageListConfig, User } from '../models';
import { catchError, distinctUntilChanged, map } from 'rxjs/operators';
import { State } from './State';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService implements OnDestroy {
  currentState: State = {};
  state$ = new BehaviorSubject(this.currentState);
  private currentUserSubject = new BehaviorSubject<User>({} as User);
  currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());
  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(private apiService: ApiService) {}

  ngOnDestroy() {
    this.state$.complete();
  }

  setMessageListConfig(cfg: MessageListConfig): void {
    this.currentState = { ...this.currentState, currentFilters: cfg };
    this.state$.next(this.currentState);
  }

  checkAuth(): Observable<User | null> {
    // vérifie le statut d'authentification dans cavus
    return this.apiService.get('/logged-user').pipe(
      map((data) => {
        this.setAuth(data.user);
        return data.user;
      }),
      catchError((err) => {
        this.purgeAuth();
        window.location.href = environment.cavus_url;
        return of(null);
      })
    );
  }

  setAuth(user: User) {
    this.currentUserSubject.next(user);
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);
  }

  purgeAuth() {
    // Set current user to an empty object
    this.currentUserSubject.next({} as User);
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);
  }

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }

  // Update the user on the server (email, pass, etc)
  update(user): Observable<User> {
    return this.apiService.put('/user', { user }).pipe(
      map((data) => {
        // Update the currentUser observable
        this.currentUserSubject.next(data.user);
        return data.user;
      })
    );
  }

  handleNotAuth() {
    alert('authentification requise');
  }
}
