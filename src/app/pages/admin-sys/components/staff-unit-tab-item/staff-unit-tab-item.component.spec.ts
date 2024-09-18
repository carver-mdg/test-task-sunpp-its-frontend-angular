import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffUnitTabItemComponent } from './staff-unit-tab-item.component';

describe('StaffUnitTabItemComponent', () => {
  let component: StaffUnitTabItemComponent;
  let fixture: ComponentFixture<StaffUnitTabItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffUnitTabItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffUnitTabItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
