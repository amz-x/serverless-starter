export const APP_ROUTES = Object.freeze({
  /* === PUBLIC ROUTES === */

  INDEX:                                          { path: '',                               url: '/'                                       },
  SIGN_IN:                                        { path: 'sign-in',                        url: '/sign-in'                                },
  SIGN_UP:                                        { path: 'sign-up',                        url: '/sign-up'                                },

  /* === AUTHENTICATED ROUTES === */

  ADMIN_INDEX:                                    { path: 'admin',                          url: '/admin'                                  },
  ADMIN_HOME:                                     { path: 'home',                           url: '/admin/home'                             },

  /* === TASKS ROUTES === */

  ADMIN_TASKS_LIST:                               { path: 'tasks',                          url: '/admin/tasks'                            },
  ADMIN_TASKS_NEW:                                { path: 'tasks/new',                      url: '/admin/tasks/new'                        },
  ADMIN_TASKS_EDIT:                               { path: 'tasks/edit/:taskId',             url: '/admin/tasks/edit/:taskId'               },
  ADMIN_TASKS_VIEW:                               { path: 'tasks/view/:taskId',             url: '/admin/tasks/view/:taskId'               },

  /* === PROFILE ROUTES === */

  ADMIN_PROFILE:                                  { path: 'profile',                        url: '/admin/profile'                          },
  ADMIN_PROFILE_SETTINGS:                         { path: 'profile/settings',               url: '/admin/profile/settings'                 },
  ADMIN_PROFILE_SETTINGS_ACCESSIBILITY:           { path: 'profile/settings/accessibility', url: '/admin/profile/settings/accessibility'   },
  ADMIN_PROFILE_SETTINGS_APPEARANCE:              { path: 'profile/settings/appearance',    url: '/admin/profile/settings/appearance'      }
});
