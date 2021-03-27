import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class PreinitService {
  constructor(private readonly userService: UserService) {}

  init() {
    return new Promise<void>((resolve, reject) => {
      this.userService.checkAuth().subscribe((user) => {
        if (user) {
          resolve();
        } else {
          reject();
        }
      });
    });
  }
}
