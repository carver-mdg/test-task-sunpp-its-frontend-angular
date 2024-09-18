import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSysComponent } from './admin-sys.component';

describe('AdminSysComponent', () => {
  let component: AdminSysComponent;
  let fixture: ComponentFixture<AdminSysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSysComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
