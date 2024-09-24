import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'app/AppSettings';
import { StaffUnitModel } from 'app/models';
import { map, Observable, throwError } from 'rxjs';
import { CreateStaffUnitRequestDTO, StaffUnitResponseDTO, UpdateStaffUnitRequestDTO } from '../dto';

@Injectable({
  providedIn: 'root'
})
export class StaffUnitService {
  /**
   * 
   * @param http Angular http
   * @param appSettings settings of application
   */
  constructor(private http: HttpClient, private appSettings: AppSettings) { }


  /**
   * Load all staff units from the server
   * 
   * @returns list of models of staff units
   */
  public loadList(): Observable<StaffUnitModel[]> {
    return this.http.get<StaffUnitResponseDTO[]>(`${this.appSettings.baseUrlAPI}/api/v1/staff-units/`).
      pipe(map((responseDTO) => {
        let staffUnits: StaffUnitModel[] = [];
        responseDTO.forEach(itemResponseDTO =>
          staffUnits.push(StaffUnitResponseDTO.toModel(itemResponseDTO))
        )
        return staffUnits;
      }))
  }


  /**
   * Save staff unit to the server
   * 
   * @param staffUnit model for sending to save
   * @returns model received from server
   */
  public save(staffUnit: StaffUnitModel): Observable<StaffUnitModel> {
    if (staffUnit.departmentID == undefined)
      return throwError(() => new Error('departmentID is undefined'));

    let dtoToSending: CreateStaffUnitRequestDTO = {
      staffUnitName: staffUnit.staffUnitName,
      departmentID: staffUnit.departmentID
    }

    return this.http.post<StaffUnitResponseDTO>(`${this.appSettings.baseUrlAPI}/api/v1/staff-units/`, dtoToSending).
      pipe(map(responseDTO => StaffUnitResponseDTO.toModel(responseDTO)));
  }


  /**
   * Update staff unit on the server
   * 
   * @param staffUnit model for sending to updating
   * @returns model received from server
   */
  public update(staffUnit: StaffUnitModel): Observable<StaffUnitModel> {
    if (staffUnit.staffUnitID == undefined)
      return throwError(() => new Error('staffUnitID is undefined'));
    if (staffUnit.departmentID == undefined)
      return throwError(() => new Error('departmentID is undefined'));

    let dtoToSending: UpdateStaffUnitRequestDTO = {
      staffUnitID: staffUnit.staffUnitID,
      staffUnitName: staffUnit.staffUnitName,
      departmentID: staffUnit.departmentID
    }

    return this.http.put<StaffUnitResponseDTO>(`${this.appSettings.baseUrlAPI}/api/v1/staff-units/${staffUnit.staffUnitID}`, dtoToSending).
      pipe(map(responseDTO => StaffUnitResponseDTO.toModel(responseDTO)));
  }


  /**
   * Delete staff unit from the server
   * 
   * @param staffUnitID ID of item for deleting
   * @returns Observable of void
   */
  public delete(staffUnitID: number): Observable<void> {
    return this.http.delete<void>(`${this.appSettings.baseUrlAPI}/api/v1/staff-units/${staffUnitID}`);
  }
}
