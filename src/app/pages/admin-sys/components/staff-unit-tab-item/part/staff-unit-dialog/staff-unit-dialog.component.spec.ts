import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffUnitDialogComponent } from './staff-unit-dialog.component';

describe('StaffUnitDialogComponent', () => {
  let component: StaffUnitDialogComponent;
  let fixture: ComponentFixture<StaffUnitDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffUnitDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffUnitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
