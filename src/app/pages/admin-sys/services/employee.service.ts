import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'app/AppSettings';
import { EmployeeModel } from 'app/models';
import { map, Observable, throwError } from 'rxjs';
import { CreateEmployeeRequestDTO, EmployeeResponseDTO, UpdateEmployeeRequestDTO } from './dto';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  /**
   * 
   * @param http Angular http
   * @param appSettings settings of application
   */
  constructor(private http: HttpClient, private appSettings: AppSettings) { }


  /**
   * Load all employees from the server
   * 
   * @returns list of models of employees
   */
  public loadList(): Observable<EmployeeModel[]> {
    return this.http.get<EmployeeResponseDTO[]>(`${this.appSettings.baseUrlAPI}/api/v1/employees/`).
      pipe(map((responseDTO) => {
        let employees: EmployeeModel[] = [];
        responseDTO.forEach(itemResponseDTO =>
          employees.push(EmployeeResponseDTO.toModel(itemResponseDTO))
        )
        return employees;
      }))
  }


  /**
   * Save employee to the server
   * 
   * @param employee model for sending to save
   * @returns model received from server
   */
  public save(employee: EmployeeModel): Observable<EmployeeModel> {
    if (employee.staffUnitID == undefined)
      return throwError(() => new Error('staffUnitID is undefined'));

    let dtoToSending: CreateEmployeeRequestDTO = {
      fullName: employee.fullName,
      staffUnitID: employee.staffUnitID
    }

    return this.http.post<EmployeeResponseDTO>(`${this.appSettings.baseUrlAPI}/api/v1/employees/`, dtoToSending).
      pipe(map(responseDTO => EmployeeResponseDTO.toModel(responseDTO)));
  }


  /**
   * Update employee on the server
   * 
   * @param employee model for sending to updating
   * @returns model received from server
   */
  public update(employee: EmployeeModel): Observable<EmployeeModel> {
    if (employee.employeeID == undefined)
      return throwError(() => new Error('employeeID is undefined'));
    if (employee.staffUnitID == undefined)
      return throwError(() => new Error('staffUnitID is undefined'));

    let dtoToSending: UpdateEmployeeRequestDTO = {
      employeeID: employee.employeeID,
      fullName: employee.fullName,
      staffUnitID: employee.staffUnitID
    }

    return this.http.put<EmployeeResponseDTO>(`${this.appSettings.baseUrlAPI}/api/v1/employees/${employee.employeeID}`, dtoToSending).
      pipe(map(responseDTO => EmployeeResponseDTO.toModel(responseDTO)));
  }


  /**
   * Delete employee from the server
   * 
   * @param employeeID ID of item for deleting
   * @returns Observable of void
   */
  public delete(employeeID: number): Observable<void> {
    return this.http.delete<void>(`${this.appSettings.baseUrlAPI}/api/v1/employees/${employeeID}`);
  }
}
