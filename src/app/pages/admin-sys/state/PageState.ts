import { inject, Injectable } from "@angular/core";
import { DepartmentsState, StaffUnitsState, EmployeesState, UsersState, ServicesSysState } from "./items";

@Injectable({
  providedIn: 'root'
})
export class PageState {
  departments = inject(DepartmentsState);
  staffUnits = inject(StaffUnitsState);
  employees = inject(EmployeesState);
  users = inject(UsersState);
  servicesSys = inject(ServicesSysState);
}