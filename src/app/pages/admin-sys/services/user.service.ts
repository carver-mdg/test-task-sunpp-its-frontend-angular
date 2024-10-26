import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'app/AppSettings';
import { UserModel } from 'app/models';
import { map, Observable, throwError } from 'rxjs';
import { CreateUserRequestDTO, UserResponseDTO, UpdateUserRequestDTO } from './dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  /**
   * 
   * @param http Angular http
   * @param appSettings settings of application
   */
  constructor(private http: HttpClient, private appSettings: AppSettings) { }


  /**
   * Load all users from the server
   * 
   * @returns list of models of users
   */
  public loadList(): Observable<UserModel[]> {
    return this.http.get<UserResponseDTO[]>(`${this.appSettings.baseUrlAPI}/api/v1/users/`).
      pipe(map((responseDTO) => {
        let users: UserModel[] = [];
        responseDTO.forEach(itemResponseDTO =>
          users.push(UserResponseDTO.toModel(itemResponseDTO))
        )
        return users;
      }))
  }


  /**
   * Save user to the server
   * 
   * @param user model for sending to save
   * @returns model received from server
   */
  public save(user: UserModel): Observable<UserModel> {
    if (user.employeeId == undefined)
      return throwError(() => new Error('employeeId is undefined'));

    let dtoToSending: CreateUserRequestDTO = {
      userName: user.userName,
      employeeId: user.employeeId
    }

    return this.http.post<UserResponseDTO>(`${this.appSettings.baseUrlAPI}/api/v1/users/`, dtoToSending).
      pipe(map(responseDTO => UserResponseDTO.toModel(responseDTO)));
  }


  /**
   * Update user on the server
   * 
   * @param user model for sending to updating
   * @returns model received from server
   */
  public update(user: UserModel): Observable<UserModel> {
    if (user.userId == undefined)
      return throwError(() => new Error('userId is undefined'));
    if (user.employeeId == undefined)
      return throwError(() => new Error('employeeId is undefined'));

    let dtoToSending: UpdateUserRequestDTO = {
      userId: user.userId,
      userName: user.userName,
      employeeId: user.employeeId
    }

    return this.http.put<UserResponseDTO>(`${this.appSettings.baseUrlAPI}/api/v1/users/${user.userId}`, dtoToSending).
      pipe(map(responseDTO => UserResponseDTO.toModel(responseDTO)));
  }


  /**
   * Delete user from the server
   * 
   * @param userID ID of item for deleting
   * @returns Observable of void
   */
  public delete(userID: number): Observable<void> {
    return this.http.delete<void>(`${this.appSettings.baseUrlAPI}/api/v1/users/${userID}`);
  }
}
