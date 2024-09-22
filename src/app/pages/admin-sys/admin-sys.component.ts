import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { DepartmentTabItemComponent } from './components/department-tab-item/department-tab-item.component';
import { StaffUnitTabItemComponent } from './components/staff-unit-tab-item/staff-unit-tab-item.component';
import { PageState, StateLoadingItem } from './PageState';
import { AdminSysService } from './services/admin-sys.service';

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
  /**
   * 
   * @param adminSysService 
   * @param pageState state of page
   */
  constructor(private adminSysService: AdminSysService, private pageState: PageState) { }

  /**
   * Lifecycle hook that is called after Angular has initialized
   */
  ngOnInit() {
    this.loadDeparatments();
  }

  /**
   * Load departments with service
   */
  private loadDeparatments() {
    this.pageState.loadingState.set({ departments: StateLoadingItem.loading() });

    this.adminSysService.loadDepartments().subscribe({
      next: departments => this.pageState.createDepartments(departments),
      error: (err) => this.pageState.loadingState.set({ departments: StateLoadingItem.error(err) }),
      complete: () => this.pageState.loadingState.set({ departments: StateLoadingItem.complete() })
    });
  }
}
