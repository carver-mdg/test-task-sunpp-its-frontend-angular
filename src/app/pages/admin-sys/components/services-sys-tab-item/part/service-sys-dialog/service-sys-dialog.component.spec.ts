import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceSysDialogComponent } from './service-sys-dialog.component';

describe('ServiceSysDialogComponent', () => {
  let component: ServiceSysDialogComponent;
  let fixture: ComponentFixture<ServiceSysDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceSysDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceSysDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
