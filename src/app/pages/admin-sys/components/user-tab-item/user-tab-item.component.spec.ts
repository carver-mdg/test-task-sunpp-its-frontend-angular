import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTabItemComponent } from './user-tab-item.component';

describe('UserTabItemComponent', () => {
  let component: UserTabItemComponent;
  let fixture: ComponentFixture<UserTabItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserTabItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTabItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
