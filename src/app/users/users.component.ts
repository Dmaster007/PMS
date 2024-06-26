import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CreateUserComponent } from '../create-user/create-user.component';
import User from './user';
import { Auth0ApiService } from '../auth0-service.service';
import { UsersService } from '../users.service';
import { DeleteIssueComponent } from '../delete-issue/delete-issue.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CreateUserComponent, CommonModule, ReactiveFormsModule ,MatIconModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  
  constructor(public dialog: MatDialog, private auth: Auth0ApiService, public usersService: UsersService) {
    this.users = this.usersService.users
  }
  
  users: User[] = this.usersService.users;
 

  addUser(): void {
    const dialogRef = this.dialog.open(CreateUserComponent, {
      data: { title: 'Create User' , name: '', email: '', password: '', role: '' }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          const user = await this.auth.createUser(result.email, result.password, result.name);
          console.log('User created:', user);
          let role = false;
          if(result.role === 'Admin'){
            role = true;
          }
          this.usersService.createUser({
            name: result.name,
            password:result.password,
            role: role,
            email:result.email
          })
          
          this.usersService.users.push({
            name: user.name,
            id: this.users.length + 1, // or however you manage IDs
            email: user.email,
            role: result.role,
            password:result.password
          });
        } catch (error) {
          console.error('Error adding user:', error);
        }
      }
    });
  }
  openDialog1(user:any): void {
    const dialogRef = this.dialog.open(DeleteIssueComponent, {
      data: {name: 'User'},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result === true) {
        this.deleteUser(user)
      }
    });
  }
  deleteUser(user: User): void {
    this.usersService.users = this.usersService.users.filter(u => u !== user);
    this.usersService.deleteUser(user)
    this.auth.deleteUserByEmail(user.email)
  }

  editUser(user: User): void {
    const dialogRef = this.dialog.open(CreateUserComponent, {
      data: { title:'Edit User',...user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        Object.assign(user, result);
        this.usersService.updateUser(user)
      }
    });
  }
}
