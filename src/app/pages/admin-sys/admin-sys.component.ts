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
import { Observable } from 'rxjs';
import { DepartmentModel, EmployeeModel, ServiceSysModel, StaffUnitModel, UserModel } from 'app/models';

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
    this.loadData();
  }


  /**
   * Loads data for various state items in the admin system component.
   *
   * This method initializes the loading process for multiple loadable items, such as departments,
   * staff units, employees, users, and service systems. Each item is represented as an `ILoadableItem`
   * containing its loading state and observable loader. The method ensures that the loading state
   * is updated appropriately during the loading lifecycle (loading, error, complete).
   *
   * @throws {Error} If an unknown state item type is encountered.
   */
  private loadData() {
    /**
     * Represents a loadable item with a specific type `T`, providing mechanisms for managing its loading state
     * and creating new instances of the item.
     *
     * @template T - The type of the item being loaded and managed.
     *
     * @property stateItem - An object containing methods to manage the loading state and create new items.
     * @property stateItem.loadingState.set - A method to set the loading state of the item.
     * @property stateItem.create - A method to create a new instance of the item with the provided data.
     *
     * @property loaderItem - An observable that emits the loaded item of type `T`.
     */
    interface ILoadableItem<T> {
      stateItem: {
        loadingState: { set: (state: StateLoadingItem) => void };
        create: (data: T) => void;
      };
      loaderItem: Observable<T>;
    }

    /**
     * Loads an item by updating its loading state and subscribing to its loader observable.
     * 
     * @template T - The type of the data being loaded.
     * @param item - The loadable item containing the state and loader observable.
     * @param item.stateItem - The state management object for the item.
     * @param item.stateItem.loadingState - The state object that tracks the loading state.
     * @param item.loaderItem - The observable that emits the data to be loaded.
     */
    function loadItem<T>(item: ILoadableItem<T>) {
      item.stateItem.loadingState.set(StateLoadingItem.loading());
      item.loaderItem.subscribe({
        next: (data: T) => item.stateItem.create(data),
        error: (err: any) => item.stateItem.loadingState.set(StateLoadingItem.error(err)),
        complete: () => item.stateItem.loadingState.set(StateLoadingItem.complete())
      });
    }

    /**
     * Represents a union type of possible loadable models for the admin system component.
     * Each model is wrapped in an `ILoadableItem` to indicate its loadable state.
     */
    type TLoadModelPossibles =
      ILoadableItem<DepartmentModel[]> |
      ILoadableItem<StaffUnitModel[]> |
      ILoadableItem<EmployeeModel[]> |
      ILoadableItem<UserModel[]> |
      ILoadableItem<ServiceSysModel[]>;

    // load data
    [
      { stateItem: this.pageState.departments, loaderItem: this.departmentService.loadList() } as ILoadableItem<DepartmentModel[]>,
      { stateItem: this.pageState.staffUnits, loaderItem: this.staffUnitService.loadList() } as ILoadableItem<StaffUnitModel[]>,
      { stateItem: this.pageState.employees, loaderItem: this.employeeService.loadList() } as ILoadableItem<EmployeeModel[]>,
      { stateItem: this.pageState.users, loaderItem: this.userService.loadList() } as ILoadableItem<UserModel[]>,
      { stateItem: this.pageState.servicesSys, loaderItem: this.serviceSysService.loadList() } as ILoadableItem<ServiceSysModel[]>
    ].forEach((item: TLoadModelPossibles) => {
      switch (item.stateItem) {
        case this.pageState.departments:
          loadItem(item as ILoadableItem<DepartmentModel[]>);
          break;

        case this.pageState.staffUnits:
          loadItem(item as ILoadableItem<StaffUnitModel[]>);
          break;

        case this.pageState.employees:
          loadItem(item as ILoadableItem<EmployeeModel[]>);
          break;

        case this.pageState.users:
          loadItem(item as ILoadableItem<UserModel[]>);
          break;

        case this.pageState.servicesSys:
          loadItem(item as ILoadableItem<ServiceSysModel[]>);
          break;

        default:
          throw new Error('Load data: Unknown state item type');
      } // /switch (item.stateItem)
    });
  }


  // @NOTE To simplify the task, just reload the page, 
  //  in a real application it is better to generate 
  //  random data on the client and in case of a successful 
  //  server response update the state of the page
  /**
   * Click on button to fill database by mock data.
   */
  public onClickFillDbByMockData() {
    this.adminSysService.fillDbByMockData().subscribe({
      next: () => window.location.reload()
    });
  }


  // @NOTE To simplify the task, just reload the page,
  //  in case of a successful server response reload the page
  /**
   * Click on button to truncate database
   */
  public onClickTruncateDb() {
    this.adminSysService.truncateDb().subscribe({
      next: () => window.location.reload()
    });
  }
}
