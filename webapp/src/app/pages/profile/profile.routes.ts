import { Route } from '@angular/router';

export const ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'profile',
    pathMatch: 'full',
  },
  {
    path: 'profile',
    title: 'Profile',
    loadComponent: async () => (await import('./profile.page')).ProfilePage,
  }
];
