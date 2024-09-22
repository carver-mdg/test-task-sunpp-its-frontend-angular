import { Injectable, signal } from "@angular/core";
import { DepartmentModel } from "app/models";

/**
 * 
 */
export class StateLoadingItem {
  isLoading: boolean;
  isLoadingError: boolean;
  loadingErrorData?: Error;

  constructor() {
    let statePurified = StateLoadingItem.reset();
    this.isLoading = statePurified.isLoading;
    this.isLoadingError = statePurified.isLoadingError;
  }

  static reset(): StateLoadingItem {
    return {
      isLoading: false,
      isLoadingError: false,
      loadingErrorData: undefined,
    }
  }

  static loading(): StateLoadingItem {
    return {
      isLoading: true,
      isLoadingError: false
    }
  }

  static error(err: any): StateLoadingItem {
    return {
      isLoading: false,
      isLoadingError: true,
      loadingErrorData: err
    }
  }

  static complete(): StateLoadingItem {
    return {
      isLoading: false,
      isLoadingError: false
    }
  }
}

/**
 * 
 */
export class StateLoading {
  departments: StateLoadingItem;

  constructor() {
    this.departments = StateLoadingItem.reset();
  }
}

/**
 * 
 */
@Injectable({
  providedIn: 'root'
})
export class PageState {
  departments = signal<DepartmentModel[]>([]);
  loadingState = signal<StateLoading>(new StateLoading());

  /**
   * Create list departments
   * 
   * @param departments 
   */
  public createDepartments(departments: DepartmentModel[]) {
    this.departments.set(departments);
  }


  /**
   * Add department to existed list of departments
   * 
   * @param department 
   */
  public addDepartment(department: DepartmentModel) {
    this.departments.set([...this.departments(), department]);
  }

  /**
   * Update department in existed list of departments
   * 
   * @param department 
 */
  updateDepartment(department: DepartmentModel) {
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
   * Delete department from existed list of departments
   * 
   * @param department 
   */
  deleteDepartment(department: DepartmentModel) {
    this.departments.set([...this.departments().filter(item =>
      item.departmentID != department.departmentID
    )]);
  }
}