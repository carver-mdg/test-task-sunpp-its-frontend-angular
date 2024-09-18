import { isDevMode } from "@angular/core";

export class AppSettings {
  baseUrlAPI = isDevMode() ? 'http://192.168.0.102:8080' : '';
}
