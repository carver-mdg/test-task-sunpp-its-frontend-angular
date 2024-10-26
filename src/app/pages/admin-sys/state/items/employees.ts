import { Injectable, signal } from "@angular/core";
import { EmployeeModel } from "app/models";
import { StateLoadingItem } from "../types";

@Injectable({
  providedIn: 'root'
})
export class EmployeesState {
  data = signal<EmployeeModel[]>([]);
  loadingState = signal<StateLoadingItem>(new StateLoadingItem());


  /**
   * Create list employees
   * 
   * @param employees 
   */
  public create(employees: EmployeeModel[]) {
    this.data.set(employees);
  }


  /**
   * Add employee to exist list of employees
   * 
   * @param employee 
   */
  public add(employee: EmployeeModel) {
    this.data.set([...this.data(), employee]);
  }


  /**
   * Update employee in exist list of employees
   * 
   * @param employee 
 */
  update(employee: EmployeeModel) {
    this.data.set([...this.data().map(itemEmployee => {
      if (itemEmployee.employeeId == employee.employeeId) {
        return {
          employeeId: employee.employeeId,
          fullName: employee.fullName,
          staffUnitId: employee.staffUnitId
        }
      }
      return itemEmployee;
    })]);
  }


  /**
   * Delete employee from exist list of employees
   * 
   * @param employee 
   */
  delete(employee: EmployeeModel) {
    this.data.set([...this.data().filter(itemEmployee =>
      itemEmployee.employeeId != employee.employeeId
    )]);
  }
}