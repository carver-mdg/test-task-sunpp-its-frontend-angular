import { Injectable, isDevMode } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AppSettings {
  baseUrlAPI = isDevMode() ? 'http://192.168.0.102:8080' : '';
}
