import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { REPOSITORY_URL } from '@lib/constants';
import { APP_ROUTES } from '@lib/constants/app.routes';
import { AuthService } from '@lib/services';

@Component({
  selector: 'admin-sidenav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.sidenav.component.html',
  styleUrls: ['./admin.sidenav.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSidenavComponent {

  readonly repositoryURL = REPOSITORY_URL;

  readonly sideNavItems  = [
    {
      title: 'Home',
      url: APP_ROUTES.ADMIN_HOME.url
    },
    {
      title: 'Tasks',
      url: APP_ROUTES.ADMIN_TASKS_LIST.url
    },
    {
      title: 'Profile',
      url: APP_ROUTES.ADMIN_PROFILE.url
    }
  ];

  constructor(private _router: Router, private _authService: AuthService) {}

  onClickSignOut(): void {
    this._authService.signOut();
    this._router.navigateByUrl(APP_ROUTES.INDEX.url);
  }
}
