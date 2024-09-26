import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTabItemComponent } from './employee-tab-item.component';

describe('EmployeeTabItemComponent', () => {
  let component: EmployeeTabItemComponent;
  let fixture: ComponentFixture<EmployeeTabItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeTabItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeTabItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
