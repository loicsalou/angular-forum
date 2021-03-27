import { Component, OnInit } from '@angular/core';

import { UserService } from './core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  langs = ['fr', 'en'];

  constructor(private userService: UserService, private readonly translateService: TranslateService) {}

  ngOnInit() {
    this.userService.checkAuth().subscribe((user) => {
      if (!user) {
        this.userService.handleNotAuth();
      } else {
        this.translateService.use(user.lang);
      }
    });
  }
}
