import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceItemPageComponent } from './service-item-page.component';

describe('ServiceItemPageComponent', () => {
  let component: ServiceItemPageComponent;
  let fixture: ComponentFixture<ServiceItemPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceItemPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceItemPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
