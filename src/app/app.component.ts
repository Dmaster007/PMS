import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { Auth0ApiService } from './auth0-service.service';
import { UsersService } from './users.service';
import { IssuesService } from './issues.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,LoginComponent,NavbarComponent,RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(public auth : Auth0ApiService , public users : UsersService , private issues : IssuesService ){}
  title = 'PMS';
  
}
