import { Injectable } from '@angular/core';
import { Role } from './role';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private login: string = '';
  private password: string = '';

  constructor() { }

  /**
   * 
   * @param login 
   * @param password 
   */
  logIn(login: string, password: string) {
    this.login = login;
    this.password = password;
  }

  /**
   * 
   * @returns 
   */
  getUserRole(): Role {
    /**
    * fake an API call
    */
    return Role.USER;
  }
}
