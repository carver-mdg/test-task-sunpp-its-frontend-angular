import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { AppSettings } from 'app/AppSettings';
import { DepartmentModel } from 'app/models';
import { map, Observable } from 'rxjs';
import { ICreateDepartmentsSendingDTO, ICreateDepartmentsReceivedDTO, IReadDepartmentsReceivedDTO, IUpdateDepartmentsReceivedDTO } from '../dto';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {
  appSettings = new AppSettings();
  // private departmentsState: WritableSignal<DepartmentModel[]> = signal<DepartmentModel[]>([]);
  // readonly departments: Signal<DepartmentModel[]> = computed(() => this.departmentsState());

  /**
   * 
   * @param http 
   */
  constructor(private http: HttpClient) { }

  /**
   * 
   * @returns 
   */
  // reloadDepartmentsFromServer(): Observable<IReadDepartmentsReceivedDTO[]> {
  //   return this.http.get<IReadDepartmentsReceivedDTO[]>(`${this.appSettings.baseUrlAPI}/api/v1/departments/`);
  // }

  /**
   * 
   * @returns 
   */
  loadDepartments(): Observable<DepartmentModel[]> {
    return this.http.get<IReadDepartmentsReceivedDTO[]>(`${this.appSettings.baseUrlAPI}/api/v1/departments/`).
      pipe(map((departmentsDTO: IReadDepartmentsReceivedDTO[]) => {
        let departments: DepartmentModel[] = [];
        departmentsDTO.forEach(itemDepartmentDTO =>
          departments.push(DepartmentModel.createFromDTO(itemDepartmentDTO))
        )
        return departments;
      }))
  }

  /**
   * 
   * @param departmentToServer 
   * @returns 
   */
  addDepartment(departmentToServer: ICreateDepartmentsSendingDTO): Observable<DepartmentModel> {
    return this.http.post<ICreateDepartmentsReceivedDTO>(`${this.appSettings.baseUrlAPI}/api/v1/departments/`, departmentToServer).
      pipe(map((departmentsDTO: ICreateDepartmentsReceivedDTO) =>
        DepartmentModel.createFromDTO(departmentsDTO)
      ));
  }

  /**
   * 
   * @param department 
   * @returns 
   */
  updateDepartment(department: DepartmentModel): Observable<DepartmentModel> {
    return this.http.put<IUpdateDepartmentsReceivedDTO>(`${this.appSettings.baseUrlAPI}/api/v1/departments/${department.departmentID}`, department).
      pipe(map((departmentsDTO: IUpdateDepartmentsReceivedDTO) =>
        DepartmentModel.createFromDTO(departmentsDTO)
      ));
  }

  /**
   * 
   * @param departmentID 
   * @returns 
   */
  deleteDepartment(departmentID: number): Observable<DepartmentModel> {
    return this.http.delete<DepartmentModel>(`${this.appSettings.baseUrlAPI}/api/v1/departments/${departmentID}`);
  }
}
