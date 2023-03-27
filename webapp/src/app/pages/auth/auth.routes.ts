import { Route } from '@angular/router';

export const ROUTES: Route[] = [
  {
    path: '/sign-in',
    title: 'Sign In',
    loadComponent: async () => (await import('./sign-in/sign-in.page')).SignInPage,
  },
  {
    path: '/sign-up',
    title: 'Sign Up',
    loadComponent: async () => (await import('./register/register.page')).RegisterPage,
  },
];
