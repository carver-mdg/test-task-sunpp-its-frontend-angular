import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceSysTabItemComponent } from './service-sys-tab-item.component';

describe('ServiceSysTabItemComponent', () => {
  let component: ServiceSysTabItemComponent;
  let fixture: ComponentFixture<ServiceSysTabItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceSysTabItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceSysTabItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
