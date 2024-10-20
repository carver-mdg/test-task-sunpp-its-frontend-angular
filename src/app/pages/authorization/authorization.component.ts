import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSettings } from 'app/AppSettings';
import { AuthService } from 'app/auth/auth.service';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthModel } from 'app/models';

@Component({
  selector: 'app-authorization',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatDividerModule, MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule,],
  templateUrl: './authorization.component.html',
  styleUrl: './authorization.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizationComponent implements OnInit, OnDestroy {
  userName = '';
  password = '';


  /**
   * 
   * @param router 
   */
  constructor(
    private appState: AppSettings,
    private authService: AuthService,
    private router: Router,
    private readonly snackBar: MatSnackBar,
  ) { }


  /**
   * 
   */
  ngOnInit(): void {
    this.appState.isShowHeader.set(false);
  }


  /**
   * 
   */
  ngOnDestroy(): void {
    this.appState.isShowHeader.set(true);
  }


  /**
   * Clicked on button signIn
   */
  onBtnClickSignIn() {
    this.authService.signIn(
      this.userName,
      this.password,
      (authModel: AuthModel) => {
        console.log(authModel);
        switch (authModel.userRoleName) {
          case "user":
            this.router.navigate(['services']);
            break;

          case "admin":
            this.router.navigate(['admin-sys']);
            break;
        }
      },
      (err: any) => this.showError(err));
  }


  /**
   * Show error
   * 
   * @param error 
   */
  private showError(error: any) {
    let errMessage: string | undefined = undefined;
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case HttpStatusCode.Forbidden:
          errMessage = "Неверный username/password";
          break;

        default:
          errMessage = error.message;
      }
    }
    else
      errMessage = error;

    this.snackBar.open(errMessage?.toString() ?? 'unknown error', 'Ok', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-error'],
    });
  }
}
