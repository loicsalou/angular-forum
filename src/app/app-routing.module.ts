import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'editor',
    loadChildren: () => import('./editor/editor.module').then((m) => m.EditorModule),
  },
  {
    path: 'message',
    loadChildren: () => import('./message/message.module').then((m) => m.MessageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // preload all modules; optionally we could
      // implement a custom preloading strategy for just some
      // of the modules (PRs welcome 😉)
      preloadingStrategy: PreloadAllModules,
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
