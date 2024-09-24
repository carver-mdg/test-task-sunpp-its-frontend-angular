import { inject, Injectable } from "@angular/core";
import { DepartmentsState } from "./items/departments";
import { StaffUnitsState } from "./items/staff-units";

@Injectable({
  providedIn: 'root'
})
export class PageState {
  departments = inject(DepartmentsState);
  staffUnits = inject(StaffUnitsState);
}