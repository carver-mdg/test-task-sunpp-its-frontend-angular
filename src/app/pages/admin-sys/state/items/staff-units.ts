import { Injectable, signal } from "@angular/core";
import { StaffUnitModel } from "app/models";
import { StateLoadingItem } from "../types";

@Injectable({
  providedIn: 'root'
})
export class StaffUnitsState {
  data = signal<StaffUnitModel[]>([]);
  loadingState = signal<StateLoadingItem>(new StateLoadingItem());


  /**
   * Create list staff units
   * 
   * @param staffUnits 
   */
  public create(staffUnits: StaffUnitModel[]) {
    this.data.set(staffUnits);
  }


  /**
   * Add staff unit to exist list of staff units
   * 
   * @param staffUnit 
   */
  public add(staffUnit: StaffUnitModel) {
    this.data.set([...this.data(), staffUnit]);
  }

  /**
   * Update staff unit in exist list of staff units
   * 
   * @param staffUnit 
 */
  update(staffUnit: StaffUnitModel) {
    this.data.set([...this.data().map(itemStaffUnit => {
      if (itemStaffUnit.staffUnitId == staffUnit.staffUnitId) {
        return {
          staffUnitId: staffUnit.staffUnitId,
          staffUnitName: staffUnit.staffUnitName,
          departmentId: staffUnit.departmentId
        }
      }
      return itemStaffUnit;
    })]);
  }

  /**
   * Delete staff unit from exist list of staff units
   * 
   * @param staffUnit 
   */
  delete(staffUnit: StaffUnitModel) {
    this.data.set([...this.data().filter(itemStaffUnit =>
      itemStaffUnit.staffUnitId != staffUnit.staffUnitId
    )]);
  }
}