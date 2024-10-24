import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ServicesService } from 'app/pages/services/services';

@Component({
  selector: 'app-service-item-page',
  standalone: true,
  imports: [],
  templateUrl: './service-item-page.component.html',
  styleUrl: './service-item-page.component.scss'
})
export class ServiceItemPageComponent implements OnInit {
  serviceId: number | undefined;
  dataFromServer: string = '';


  /**
   * Controller
   * 
   * @param activatedRoute 
   */
  constructor(
    private servicesServices: ServicesService,
    private activatedRoute: ActivatedRoute,
    private readonly snackBar: MatSnackBar,
  ) {
  }


  /**
   * Component init
   */
  ngOnInit(): void {
    const serviceId = this.activatedRoute.snapshot.paramMap.get('id');
    if (serviceId == undefined) throw new Error("ServiceID is undefined");

    this.serviceId = parseInt(serviceId);
    
    this.servicesServices.loadServiceItem(this.serviceId).subscribe(
      {
        next: data => this.dataFromServer = data,
        error: err => this.showError(err),
      }
    );
  }


  /**
   * Show error
   * 
   * @param error 
   */
  private showError(error: any) {
    let errMessage: string | undefined = undefined;
    if (error instanceof HttpErrorResponse) {
      if (error.status == HttpStatusCode.Forbidden)
        errMessage = "У вас нет доступа к сервису";
      else errMessage = error.message;
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
