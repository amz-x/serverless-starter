import { Routes } from '@angular/router';
import { AuthGuard, NoAuthGuard } from '@lib/guards';

// Constants
import { APP_ROUTES } from '@lib/constants/app.routes';

export const routes: Routes = [
  {
    path: APP_ROUTES.INDEX.path,
    title: 'Welcome',
    loadComponent: async () => (await import('@pages/index/index.page')).IndexPage,
    canLoad: [AuthGuard, NoAuthGuard],
    canActivate: [NoAuthGuard]
  },
  // {
  //   path: APP_ROUTES.SIGN_IN.path,
  //   title: 'Sign In',
  //   loadComponent: async () => (await import('@pages/auth/sign-in/sign-in.page')).SignInPage,
  //   canLoad: [NoAuthGuard],
  //   canActivate: [NoAuthGuard]
  // },
  // {
  //   path: APP_ROUTES.SIGN_UP.path,
  //   title: 'Sign Up',
  //   loadComponent: async () => (await import('@pages/auth/register/register.page')).RegisterPage,
  //   canLoad: [NoAuthGuard],
  //   canActivate: [NoAuthGuard]
  // },
  {
    path: APP_ROUTES.ADMIN_INDEX.path,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [

      /* === ADMIN - HOME SECTION === */
      {
        path: APP_ROUTES.ADMIN_HOME.path,
        title: 'HOME',
        pathMatch: 'full',
        canLoad: [AuthGuard],
        loadComponent: async () => (await import('@pages/home/home.page')).HomePage,
      },

      /* === ADMIN - TASKS SECTION === */

      {
        path: APP_ROUTES.ADMIN_TASKS_NEW.path,
        title: 'TASKS - NEW',
        canLoad: [AuthGuard],
        loadComponent: async () => (await import('@pages/home/home.page')).HomePage,
      },
      {
        path: APP_ROUTES.ADMIN_TASKS_EDIT.path,
        title: 'TASKS - EDIT',
        canLoad: [AuthGuard],
        loadComponent: async () => (await import('@pages/home/home.page')).HomePage,
      },
      {
        path: APP_ROUTES.ADMIN_TASKS_VIEW.path,
        title: 'TASKS - VIEW',
        canLoad: [AuthGuard],
        loadComponent: async () => (await import('@pages/home/home.page')).HomePage,
      },
      {
        path: APP_ROUTES.ADMIN_TASKS_LIST.path,
        title: 'TASKS - LISTING',
        canLoad: [AuthGuard],
        loadComponent: async () => (await import('@pages/home/home.page')).HomePage,
      },

      /* === ADMIN - PROFILE SECTION === */

      {
        path: APP_ROUTES.ADMIN_PROFILE.path,
        title: 'PROFILE',
        canLoad: [AuthGuard],
        loadComponent: async () => (await import('@pages/profile/profile.page')).ProfilePage,
      },
      {
        path: APP_ROUTES.ADMIN_PROFILE_SETTINGS.path,
        title: 'PROFILE - SETTINGS',
        canLoad: [AuthGuard],
        loadComponent: async () => (await import('@pages/profile/settings/account/account.page')).AccountPage,
      },
      {
        path: APP_ROUTES.ADMIN_PROFILE_SETTINGS_ACCESSIBILITY.path,
        title: 'PROFILE - SETTINGS - ACCESSIBILITY',
        canLoad: [AuthGuard],
        loadComponent: async () => (await import('@pages/profile/settings/accessibility/accessibility.page')).AccessibilityPage,
      },
      {
        path: APP_ROUTES.ADMIN_PROFILE_SETTINGS_APPEARANCE.path,
        title: 'PROFILE - SETTINGS - APPEARANCE',
        canLoad: [AuthGuard],
        loadComponent: async () => (await import('@pages/profile/settings/appearance/appearance.page')).AppearancePage,
      }
    ]
  },
  {
    path: '**',
    title: 'PAGE NOT FOUND',
    loadComponent: async () => (await import('@pages/screens/not-found/not-found.page')).NotFoundPage,
  },
];
