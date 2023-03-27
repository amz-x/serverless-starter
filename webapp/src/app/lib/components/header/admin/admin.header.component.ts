import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { REPOSITORY_URL } from '@lib/constants';
import { APP_ROUTES } from '@lib/constants/app.routes';
import { AuthService } from '@lib/services';
import { LogoComponent } from '../../logo/logo.component';

// Components
import { AdminSidenavComponent } from '@lib/components/sidenav/admin/admin.sidenav.component';

@Component({
  selector: 'admin-header',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminSidenavComponent, LogoComponent],
  templateUrl: './admin.header.component.html',
  styleUrls: ['./admin.header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminHeaderComponent {

  readonly repositoryURL = REPOSITORY_URL;

  constructor(private _router: Router, private _authService: AuthService) {}

  onClickSignOut(): void {
    this._authService.signOut();
    this._router.navigateByUrl(APP_ROUTES.INDEX.url);
  }
}
