import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceSysListComponent } from './service-sys-list.component';

describe('ServiceSysListComponent', () => {
  let component: ServiceSysListComponent;
  let fixture: ComponentFixture<ServiceSysListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceSysListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceSysListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
