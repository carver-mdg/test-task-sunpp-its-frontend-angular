import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { DepartmentTabItemComponent } from './components/department-tab-item/department-tab-item.component';
import { EmployeeTabItemComponent } from './components/employee-tab-item/employee-tab-item.component';
import { ServiceSysTabItemComponent } from "./components/services-sys-tab-item/service-sys-tab-item.component";
import { StaffUnitTabItemComponent } from './components/staff-unit-tab-item/staff-unit-tab-item.component';
import { UserTabItemComponent } from './components/user-tab-item/user-tab-item.component';
import { AdminSysService, DepartmentService, EmployeeService, ServiceSysService, StaffUnitService, UserService } from './services';
import { PageState } from './state/PageState';
import { StateLoadingItem } from './state/types';

@Component({
  selector: 'app-admin-sys',
  standalone: true,
  imports: [
    MatTabsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    DepartmentTabItemComponent, StaffUnitTabItemComponent, EmployeeTabItemComponent, UserTabItemComponent,
    ServiceSysTabItemComponent
],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-sys.component.html',
  styleUrl: './admin-sys.component.scss'
})
export class AdminSysComponent implements OnInit {
  /**
   * Init instance of component class
   * 
   * @param adminSysService
   * @param departmentService
   * @param staffUnitService
   * @param employeeService
   * @param userService
   * @param serviceSysService
   * @param pageState state of page
   */
  constructor(
    private adminSysService: AdminSysService,
    private departmentService: DepartmentService,
    private staffUnitService: StaffUnitService,
    private employeeService: EmployeeService,
    private userService: UserService,
    private serviceSysService: ServiceSysService,
    private pageState: PageState) { }


  /**
   * Lifecycle hook that is called after Angular has initialized
   */
  ngOnInit() {
    this.loadDeparatments();
    this.loadStaffUnits();
    this.loadEmployees();
    this.loadUsers();
    this.loadServicesSys();
    

    /*
    @COMMENT How rewrite several load functions to single code bellow ?

        // Load data
        [
          { stateItem: this.pageState.departments, loaderItem: this.departmentService.loadList() },
          { stateItem: this.pageState.staffUnits, loaderItem: this.staffUnitService.loadList() },
          { stateItem: this.pageState.employees, loaderItem: this.employeeService.loadList() },
          { stateItem: this.pageState.users, loaderItem: this.userService.loadList() },
          { stateItem: this.pageState.servicesSys, loaderItem: this.serviceSysService.loadList() },
        ].forEach(item => {
          item.stateItem.loadingState.set(StateLoadingItem.loading());

          item.loaderItem.subscribe({
            next: data => item.stateItem.create(data),
            error: (err) => item.stateItem.loadingState.set(StateLoadingItem.error(err)),
            complete: () => item.stateItem.loadingState.set(StateLoadingItem.complete())
          });
        });
    */
  }


  /**
   * Click on button to fill database by mock data.
   * 
   * @NOTE To simplify the task, just reload the page, 
   * in a real application it is better to generate 
   * random data on the client and in case of a successful 
   * server response update the state of the page
   */
  public onClickFillDbByMockData() {
    this.adminSysService.fillDbByMockData().subscribe({
      next: () => window.location.reload()
    });
  }


  /**
   * Click on button to truncate database
   * 
   * @NOTE To simplify the task, just reload the page, 
   * in a real application it is better to generate 
   * random data on the client and in case of a successful 
   * server response update the state of the page
   */
  public onClickTruncateDb() {
    this.adminSysService.truncateDb().subscribe({
      next: () => window.location.reload()
    });
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


  /**
  * Load system services with service
  */
  private loadServicesSys() {
    this.pageState.servicesSys.loadingState.set(StateLoadingItem.loading());

    this.serviceSysService.loadList().subscribe({
      next: services => this.pageState.servicesSys.create(services),
      error: (err) => this.pageState.servicesSys.loadingState.set(StateLoadingItem.error(err)),
      complete: () => this.pageState.servicesSys.loadingState.set(StateLoadingItem.complete())
    });
  }
}
