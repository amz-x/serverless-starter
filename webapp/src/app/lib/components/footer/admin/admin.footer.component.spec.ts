import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AdminFooterComponent } from './admin.footer.component';

describe('AdminFooterComponent', () => {
  let component: AdminFooterComponent;
  let fixture: ComponentFixture<AdminFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminFooterComponent, RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
