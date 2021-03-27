import { Component, Input, OnInit } from '@angular/core';

import { User, UserService } from '../../core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  currentUser: User;
  @Input() langs: string[];
  profileHref: string;

  constructor(private userService: UserService, private readonly translateService: TranslateService) {}

  get currentLang(): string {
    return this.translateService.currentLang;
  }

  set currentLang(lang: string) {
    this.translateService.use(lang);
  }

  ngOnInit() {
    this.userService.state$.subscribe((state) => {
      this.currentUser = state.user;
    });
    this.profileHref = environment.cavus_url + '/' + this.currentLang + '/modifdonnees.php';
  }
}
