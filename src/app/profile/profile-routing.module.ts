import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileMessagesComponent } from './profile-messages.component';
import { ProfileFavoritesComponent } from './profile-favorites.component';
import { ProfileResolver } from './profile-resolver.service';
import { ProfileComponent } from './profile.component';

const routes: Routes = [
  {
    path: ':username',
    component: ProfileComponent,
    resolve: {
      profile: ProfileResolver,
    },
    children: [
      {
        path: '',
        component: ProfileMessagesComponent,
      },
      {
        path: 'favorites',
        component: ProfileFavoritesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
