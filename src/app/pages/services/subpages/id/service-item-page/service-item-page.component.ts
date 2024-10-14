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
  }

}
