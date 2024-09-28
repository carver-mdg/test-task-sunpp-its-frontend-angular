import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'app/AppSettings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminSysService {
  /**
   * 
   * @param http Angular http
   * @param appSettings settings of application
   */
  constructor(
    private http: HttpClient,
    private appSettings: AppSettings,
  ) { }


  /**
   * Send command to create mock data on the server
   * 
   * @returns Observable of void
   */
  public fillDbByMockData(): Observable<void> {
    return this.http.post<void>(`${this.appSettings.baseUrlAPI}/api/v1/admin-sys/fill-mock-data`, {});
  }


  /**
   * Send command to truncate database on the server
   * 
   * @returns Observable of void
   */
  public truncateDb(): Observable < void> {
  return this.http.post<void>(`${this.appSettings.baseUrlAPI}/api/v1/admin-sys/truncate-db`, {});
}
}
