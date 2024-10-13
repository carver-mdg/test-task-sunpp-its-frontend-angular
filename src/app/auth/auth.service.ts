import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from 'app/AppSettings';
import { AuthRequestDTO, AuthResponseDTO } from './dto';
import { AuthModel } from 'app/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: AuthModel = new AuthModel();


  /**
   * 
   * @param http 
   * @param appSettings 
   */
  constructor(
    private http: HttpClient,
    private appSettings: AppSettings
  ) { }


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
   * 
   */
  signOut() { }


  /**
   * 
   */
  check(
    onSuccessFn: Function = (isLogged: boolean) => { },
    onErrorFn: Function = (error: any) => { }) {

      // this.auth = JSON.parse(localStorage.getItem('auth')) as AuthModel;

    let dtoToSending: AuthRequestDTO = {
      userName: this.auth.userName,
      password: 'password'
    }

    return this.http.post<boolean>(`${this.appSettings.baseUrlAPI}/api/v1/auth/check`, dtoToSending);
  }


  /**
   * 
   * @returns 
   */
  getUserRole(): string {
    return this.auth.userRoleName;
  }


  /**
   * 
   * @returns 
   */
  getUserName(): string {
    return this.auth.userName;
  }
}
