import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { REPOSITORY_URL } from '@lib/constants';
import { LogoComponent } from '../../logo/logo.component';

@Component({
  selector: 'admin-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, LogoComponent],
  templateUrl: './admin.footer.component.html',
  styleUrls: ['./admin.footer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminFooterComponent {
  readonly repositoryURL = REPOSITORY_URL;
  readonly currentYear = new Date().getFullYear();
}
