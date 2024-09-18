import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentTabItemComponent } from './department-tab-item.component';

describe('DepartmentTabItemComponent', () => {
  let component: DepartmentTabItemComponent;
  let fixture: ComponentFixture<DepartmentTabItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentTabItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentTabItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
