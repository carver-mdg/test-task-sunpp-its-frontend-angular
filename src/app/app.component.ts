import { Component, computed, OnInit, Signal, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppSettings } from './AppSettings';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive,
    MatIconModule, MatButtonModule, MatToolbarModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'sunpp-its-frontend';
  isShowHeader: Signal<boolean> = computed(() => this.appState.isShowHeader());
  // userName: Signal<string> = computed(() => this.authService.getUserName());


  /**
   * 
   * @param appState 
   */
  constructor(
    private appState: AppSettings,
    public authService: AuthService,
  ) { }


  /**
   * 
   */
  ngOnInit(): void { }
}
