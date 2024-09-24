import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffUnitListComponent } from './staff-unit-list.component';

describe('StaffUnitListComponent', () => {
  let component: StaffUnitListComponent;
  let fixture: ComponentFixture<StaffUnitListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffUnitListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffUnitListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
