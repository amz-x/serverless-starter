import { Route } from '@angular/router';
import { NoAuthGuard } from '@lib/guards';

export const ROUTES: Route[] = [
  {
    path: '',
    title: 'Welcome',
    loadComponent: async () => (await import('./index.page')).IndexPage,
    canLoad: [NoAuthGuard]
  }
];
