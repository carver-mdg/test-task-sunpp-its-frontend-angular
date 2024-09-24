import { Injectable, signal } from "@angular/core";
import { DepartmentModel } from "app/models";
import { StateLoadingItem } from "../types";

@Injectable({
  providedIn: 'root'
})
export class DepartmentsState {
  data = signal<DepartmentModel[]>([]);
  loadingState = signal<StateLoadingItem>(new StateLoadingItem());

  /**
   * Create list departments
   * 
   * @param departments 
   */
  public create(departments: DepartmentModel[]) {
    this.data.set(departments);
  }


  /**
   * Add department to exist list of departments
   * 
   * @param department 
   */
  public add(department: DepartmentModel) {
    this.data.set([...this.data(), department]);
  }

  /**
   * Update department in exist list of departments
   * 
   * @param department 
 */
  update(department: DepartmentModel) {
    this.data.set([...this.data().map(itemDepartment => {
      if (itemDepartment.departmentID == department.departmentID) {
        return {
          departmentID: department.departmentID,
          departmentName: department.departmentName
        }
      }
      return itemDepartment;
    })]);
  }

  /**
   * Delete department from exist list of departments
   * 
   * @param department 
   */
  delete(department: DepartmentModel) {
    this.data.set([...this.data().filter(itemDepartment =>
      itemDepartment.departmentID != department.departmentID
    )]);
  }
}