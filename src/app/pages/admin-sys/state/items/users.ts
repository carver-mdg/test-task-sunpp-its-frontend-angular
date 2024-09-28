import { Injectable, signal } from "@angular/core";
import { UserModel } from "app/models";
import { StateLoadingItem } from "../types";

@Injectable({
  providedIn: 'root'
})
export class UsersState {
  data = signal<UserModel[]>([]);
  loadingState = signal<StateLoadingItem>(new StateLoadingItem());


  /**
   * Create list users
   * 
   * @param users 
   */
  public create(users: UserModel[]) {
    this.data.set(users);
  }


  /**
   * Add user to exist list of users
   * 
   * @param user 
   */
  public add(user: UserModel) {
    this.data.set([...this.data(), user]);
  }


  /**
   * Update user in exist list of users
   * 
   * @param user 
 */
  update(user: UserModel) {
    this.data.set([...this.data().map(itemUser => {
      if (itemUser.userID == user.userID) {
        return {
          userID: user.userID,
          login: user.login,
          employeeID: user.employeeID
        }
      }
      return itemUser;
    })]);
  }


  /**
   * Delete user from exist list of users
   * 
   * @param user 
   */
  delete(user: UserModel) {
    this.data.set([...this.data().filter(itemUser =>
      itemUser.userID != user.userID
    )]);
  }
}