import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from 'app/AppSettings';
import { AuthRequestDTO, AuthResponseDTO } from './dto';
import { AuthModel } from 'app/models';
import { map, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: AuthModel | undefined = new AuthModel();


  /**
   * 
   * @param http 
   * @param appSettings 
   */
  constructor(
    private http: HttpClient,
    private appSettings: AppSettings,
    private router: Router,
  ) {
    // console.log(localStorage.getItem("auth"));
    let authJson = localStorage.getItem("auth");
    if (authJson == undefined) this.auth = undefined;
    else this.auth = JSON.parse(authJson)
    // this.auth = JSON.parse(localStorage.getItem("auth") || '""') || undefined;
  }


  /**
   * 
   * @param username 
   * @param password 
   */
  signIn(
    username: string,
    password: string,
    onSuccessFn: Function = (authModel: AuthModel) => { },
    onErrorFn: Function = (error: any) => { }) {

    let dtoToSending: AuthRequestDTO = {
      userName: username,
      password: password
    }

    this.http.post<AuthResponseDTO>(`${this.appSettings.baseUrlAPI}/api/v1/auth/signin`, dtoToSending).subscribe({
      next: responseDTO => {
        this.auth = AuthResponseDTO.toModel(responseDTO);

        localStorage.setItem('auth', JSON.stringify(this.auth));
        onSuccessFn(this.auth);
      },
      error: err => onErrorFn(err)
    });
  }


  /**
   * Sign out of user
   */
  signOut() {
    this.auth = undefined;
    localStorage.removeItem('auth');
    this.router.navigate(['authorization']);
  }


  /**
   * 
   */
  check(
    onSuccessFn: Function = (isLogged: boolean) => { },
    onErrorFn: Function = (error: any) => { }
  ) {

    if (this.auth == undefined) return of(false);

    let dtoToSending: AuthRequestDTO = {
      userName: this.auth.userName,
      password: 'password'
    }

    return this.http.post<boolean>(`${this.appSettings.baseUrlAPI}/api/v1/auth/check`, dtoToSending);
  }


  /**
   * Check have user access to service or not.
   */
  isHasAccessUserToService(service_id: number) {
    let options = {
      headers: new HttpHeaders({
        'Accept': 'text/plain'
      }),
      'responseType': 'text' as 'json'
    }

    // @NOTE To simplify the task, i'm use this url, maybe in a real application it is better use another url
    return this.http.get<string>(`${this.appSettings.baseUrlAPI}/api/v1/services/${service_id}/users/${this.auth?.userId}`, options)
      .pipe(map(res => {
        if (res) return true
        return false;
      }));
  }


  /**
   * 
   * @returns 
   */
  getUserRoleId(): number {
    if (this.auth == undefined) throw new Error('auth is undefined');
    return this.auth.userRoleId;
  }


  /**
   * 
   * @returns 
   */
  getUserRoleName(): string {
    if (this.auth == undefined) throw new Error('auth is undefined');
    return this.auth.userRoleName;
  }


  /**
 * 
 * @returns 
 */
  getUserId(): number {
    if (this.auth == undefined) throw new Error('auth is undefined');
    return this.auth.userId;
  }


  /**
   * 
   * @returns 
   */
  getUserName(): string {
    // if (this.auth == undefined) throw new Error('auth is undefined');
    if (this.auth == undefined) return "";
    return this.auth.userName;
  }
}
