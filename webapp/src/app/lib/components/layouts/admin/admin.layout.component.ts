import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

// Components
import { AdminHeaderComponent }   from '@lib/components/header/admin/admin.header.component';
import { AdminContentComponent }  from '@lib/components/content/admin/admin.content.component';
import { AdminSidenavComponent }  from '@lib/components/sidenav/admin/admin.sidenav.component';
import { AdminFooterComponent }   from '@lib/components/footer/admin/admin.footer.component';

@Component({
  selector: 'admin-layout',
  standalone: true,
  imports: [CommonModule, AdminHeaderComponent, AdminSidenavComponent, AdminContentComponent, AdminFooterComponent],
  templateUrl: './admin.layout.component.html',
  styleUrls: ['./admin.layout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayoutComponent {}
