import { ChangeDetectionStrategy, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { AppServiceService } from './services/app.service.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DepartmentTabItemComponent } from './components/department-tab-item/department-tab-item.component';
import { StaffUnitTabItemComponent } from './components/staff-unit-tab-item/staff-unit-tab-item.component';
import { DepartmentModel } from 'app/models';

@Component({
  selector: 'app-admin-sys',
  standalone: true,
  imports: [
    MatTabsModule, MatFormFieldModule, MatInputModule,
    DepartmentTabItemComponent, StaffUnitTabItemComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-sys.component.html',
  styleUrl: './admin-sys.component.scss'
})
export class AdminSysComponent implements OnInit {
  departments = signal<DepartmentModel[]>([]);

  /**
   * 
   * @param appService 
   */
  constructor(private appService: AppServiceService) { }

  /**
   * 
   */
  ngOnInit() {
    this.appService.loadDepartments().subscribe(data => this.departments.set(data));
  }

  /**
   * 
   */
  onCreateDepartmentEvent(department: DepartmentModel) {
    this.departments.set([...this.departments(), department]);
  }

  /**
 * 
 */
  onUpdateDepartmentEvent(department: DepartmentModel) {
    this.departments.set([...this.departments().map(item => {
      if (item.departmentID == department.departmentID) {
        return {
          departmentID: department.departmentID,
          departmentName: department.departmentName
        }
      }
      return item;
    })]);
  }

  /**
   * 
   */
  onDeleteDepartmentEvent(department: DepartmentModel) {
    this.departments.set([...this.departments().filter(item =>
      item.departmentID != department.departmentID
    )]);
  }
}
