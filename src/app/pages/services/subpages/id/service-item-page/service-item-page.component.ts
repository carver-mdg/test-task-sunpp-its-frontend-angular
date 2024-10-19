import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-service-item-page',
  standalone: true,
  imports: [],
  templateUrl: './service-item-page.component.html',
  styleUrl: './service-item-page.component.scss'
})
export class ServiceItemPageComponent implements OnInit {
  serviceId: string = '';
  dataFromServer: string = '';


  /**
   * 
   * @param activatedRoute 
   */
  constructor(
    private activatedRoute: ActivatedRoute
  ) {
  }


  /**
   * 
   */
  ngOnInit(): void {
    this.serviceId = this.activatedRoute.snapshot.paramMap.get('id') ?? '';
    this.dataFromServer = this.activatedRoute.snapshot.paramMap.get('data') ?? '';
    // this.dataFromServer = this.activatedRoute.data
    // console.log(this.activatedRoute.data);
  }

}
