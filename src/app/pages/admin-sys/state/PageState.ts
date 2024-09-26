import { inject, Injectable } from "@angular/core";
import { DepartmentsState, StaffUnitsState, EmployeesState } from "./items";

@Injectable({
  providedIn: 'root'
})
export class PageState {
  departments = inject(DepartmentsState);
  staffUnits = inject(StaffUnitsState);
  employees = inject(EmployeesState);
}