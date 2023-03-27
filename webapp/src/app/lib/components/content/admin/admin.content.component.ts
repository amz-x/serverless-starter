import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

// Components
import { AdminHeaderComponent }   from '@lib/components/header/admin/admin.header.component';
import { AdminSidenavComponent }  from '@lib/components/sidenav/admin/admin.sidenav.component';
import { AdminFooterComponent }   from '@lib/components/footer/admin/admin.footer.component';

@Component({
  selector: 'admin-content',
  standalone: true,
  imports: [CommonModule, AdminHeaderComponent, AdminSidenavComponent, AdminFooterComponent],
  templateUrl: './admin.content.component.html',
  styleUrls: ['./admin.content.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminContentComponent {}
