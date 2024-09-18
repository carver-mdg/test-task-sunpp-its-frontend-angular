import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-authorization',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatDividerModule, MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule, ],
  templateUrl: './authorization.component.html',
  styleUrl: './authorization.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizationComponent {
  login = '';
  password = ''; 
}
