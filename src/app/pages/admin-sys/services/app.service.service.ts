import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'app/AppSettings';
import { DepartmentModel } from 'app/models';
import { map, Observable } from 'rxjs';
import { CreateDepartmentRequestDTO, DepartmentResponseDTO, UpdateDepartmentRequestDTO } from '../dto';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {
  appSettings = new AppSettings();

  /**
   * 
   * @param http 
   */
  constructor(private http: HttpClient) { }

  /**
   * 
   * @returns 
   */
  loadDepartments(): Observable<DepartmentModel[]> {
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
   * 
   * @param departmentToServer 
   * @returns 
   */
  addDepartment(departmentToServer: CreateDepartmentRequestDTO): Observable<DepartmentModel> {
    return this.http.post<DepartmentResponseDTO>(`${this.appSettings.baseUrlAPI}/api/v1/departments/`, departmentToServer).
      pipe(map(departmentsDTO => DepartmentResponseDTO.toModel(departmentsDTO)));
  }

  /**
   * 
   * @param department 
   * @returns 
   */
  updateDepartment(department: UpdateDepartmentRequestDTO): Observable<DepartmentModel> {
    return this.http.put<DepartmentResponseDTO>(`${this.appSettings.baseUrlAPI}/api/v1/departments/${department.departmentID}`, department).
      pipe(map(departmentsDTO => DepartmentResponseDTO.toModel(departmentsDTO)));
  }

  /**
   * 
   * @param departmentID 
   * @returns 
   */
  deleteDepartment(departmentID: number): Observable<void> {
    return this.http.delete<void>(`${this.appSettings.baseUrlAPI}/api/v1/departments/${departmentID}`);
  }
}
