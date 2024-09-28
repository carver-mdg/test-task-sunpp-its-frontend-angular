import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { DepartmentTabItemComponent } from './components/department-tab-item/department-tab-item.component';
import { EmployeeTabItemComponent } from './components/employee-tab-item/employee-tab-item.component';
import { StaffUnitTabItemComponent } from './components/staff-unit-tab-item/staff-unit-tab-item.component';
import { UserTabItemComponent } from './components/user-tab-item/user-tab-item.component';
import { DepartmentService, EmployeeService, StaffUnitService, UserService } from './services';
import { PageState } from './state/PageState';
import { StateLoadingItem } from './state/types';

@Component({
  selector: 'app-admin-sys',
  standalone: true,
  imports: [
    MatTabsModule, MatFormFieldModule, MatInputModule,
    DepartmentTabItemComponent, StaffUnitTabItemComponent, EmployeeTabItemComponent, UserTabItemComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-sys.component.html',
  styleUrl: './admin-sys.component.scss'
})
export class AdminSysComponent implements OnInit {
  /**
   * 
   * @param departmentService 
   * @param pageState state of page
   */
  constructor(
    private departmentService: DepartmentService,
    private staffUnitService: StaffUnitService,
    private employeeService: EmployeeService,
    private userService: UserService,
    private pageState: PageState) { }


  /**
   * Lifecycle hook that is called after Angular has initialized
   */
  ngOnInit() {
    this.loadDeparatments();
    this.loadStaffUnits();
    this.loadEmployees();
    this.loadUsers();
  }


  /**
   * Load departments with service
   */
  private loadDeparatments() {
    this.pageState.departments.loadingState.set(StateLoadingItem.loading());

    this.departmentService.loadDepartments().subscribe({
      next: departments => this.pageState.departments.create(departments),
      error: (err) => this.pageState.departments.loadingState.set(StateLoadingItem.error(err)),
      complete: () => this.pageState.departments.loadingState.set(StateLoadingItem.complete())
    });
  }


  /**
   * Load staff units with service
  */
  private loadStaffUnits() {
    this.pageState.staffUnits.loadingState.set(StateLoadingItem.loading());

    this.staffUnitService.loadList().subscribe({
      next: staffUnits => this.pageState.staffUnits.create(staffUnits),
      error: (err) => this.pageState.staffUnits.loadingState.set(StateLoadingItem.error(err)),
      complete: () => this.pageState.staffUnits.loadingState.set(StateLoadingItem.complete())
    });
  }


  /**
   * Load employees with service
  */
  private loadEmployees() {
    this.pageState.employees.loadingState.set(StateLoadingItem.loading());

    this.employeeService.loadList().subscribe({
      next: employees => this.pageState.employees.create(employees),
      error: (err) => this.pageState.employees.loadingState.set(StateLoadingItem.error(err)),
      complete: () => this.pageState.employees.loadingState.set(StateLoadingItem.complete())
    });
  }


  /**
   * Load users with service
  */
  private loadUsers() {
    this.pageState.users.loadingState.set(StateLoadingItem.loading());

    this.userService.loadList().subscribe({
      next: users => this.pageState.users.create(users),
      error: (err) => this.pageState.users.loadingState.set(StateLoadingItem.error(err)),
      complete: () => this.pageState.users.loadingState.set(StateLoadingItem.complete())
    });
  }
}
