import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'app/AppSettings';
import { DepartmentModel } from 'app/models';
import { delay, map, Observable, throwError } from 'rxjs';
import { CreateDepartmentRequestDTO, DepartmentResponseDTO, UpdateDepartmentRequestDTO } from './dto';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  /**
   * 
   * @param http Angular http
   * @param appSettings settings of application
   */
  constructor(private http: HttpClient, private appSettings: AppSettings) { }


  /**
   * Load all departments from the server
   * 
   * @returns list of models of departments
   */
  public loadList(): Observable<DepartmentModel[]> {
    return this.http.get<DepartmentResponseDTO[]>(`${this.appSettings.baseUrlAPI}/api/v1/departments/`).
      pipe(map((departmentsDTO) => {
        let departments: DepartmentModel[] = [];
        departmentsDTO.forEach(itemDepartmentDTO =>
          departments.push(DepartmentResponseDTO.toModel(itemDepartmentDTO))
        )
        return departments;
      }))
  }


  /**
   * Save department to the server
   * 
   * @param department department for saving
   * @returns model of saved department
   */
  public saveDepartment(department: CreateDepartmentRequestDTO): Observable<DepartmentModel> {
    let dtoToSending: CreateDepartmentRequestDTO = {
      departmentName: department.departmentName,
    }

    return this.http.post<DepartmentResponseDTO>(`${this.appSettings.baseUrlAPI}/api/v1/departments/`, dtoToSending).
      pipe(map(departmentDTO => DepartmentResponseDTO.toModel(departmentDTO)));
  }


  /**
   * Update department on the server
   * 
   * @param department department for updating
   * @returns model of updated department
   */
  public updateDepartment(department: DepartmentModel): Observable<DepartmentModel> {
    if (department.departmentID == undefined)
      return throwError(() => new Error('departmentID is undefined'));

    let dtoToSending: UpdateDepartmentRequestDTO = {
      departmentID: department.departmentID,
      departmentName: department.departmentName,
    }

    return this.http.put<DepartmentResponseDTO>(`${this.appSettings.baseUrlAPI}/api/v1/departments/${department.departmentID}`, dtoToSending).
      pipe(map(departmentDTO => DepartmentResponseDTO.toModel(departmentDTO)));
  }


  /**
   * Delete department from the server
   * 
   * @param departmentID ID of department for deleting
   * @returns Observable of void
   */
  public deleteDepartment(departmentID: number): Observable<void> {
    return this.http.delete<void>(`${this.appSettings.baseUrlAPI}/api/v1/departments/${departmentID}`);
  }


  /**
   * Emulate error loading data
   * 
   * @returns list of models of departments
   */
  public emulateLoadError(): Observable<void> {
    return throwError(() => new HttpErrorResponse({
      status: 123,
      statusText: 'some error',
      error: [{
        err_1: 'some err 1',
        err_2: 'some err 2',
        err_3: 'some err 3',
      }]
    }));
  }


  /**
   * Emulate slow loading data
   * 
   * @returns list of models of departments
   */
  public emulateLoadSlow(): Observable<DepartmentModel[]> {
    return this.loadList().pipe(delay(3000));
  }
}
