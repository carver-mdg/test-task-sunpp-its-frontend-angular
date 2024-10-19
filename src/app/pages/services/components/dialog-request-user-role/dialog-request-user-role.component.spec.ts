import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRequestUserRoleComponent } from './dialog-request-user-role.component';

describe('DialogRequestUserRoleComponent', () => {
  let component: DialogRequestUserRoleComponent;
  let fixture: ComponentFixture<DialogRequestUserRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogRequestUserRoleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogRequestUserRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
