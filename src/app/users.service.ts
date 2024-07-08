import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Auth0ApiService } from './auth0-service.service';
import User from './users/user';
import newUser from './newUser';
import { Subscription } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root',
})
export class UsersService implements OnDestroy {
  public users: User[] = [];
  public userM:any = {}
  private userSubscription: Subscription = new Subscription();
  constructor(private http: HttpClient, private auth: Auth0ApiService ,private authSer :AuthService) {
    this.getAllUsers();
    setTimeout(() => {
      this.userSubscription = this.authSer.user$.subscribe((data) => {
        this.userM = data;
         // Assuming data is your user object emitted by user$
         this.userM = this.users.find((user)=> user.email === data?.email);
        //  console.log(this.userM);
         
      });
    }, 1000);
    
  }
  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe(); // Unsubscribe to prevent memory leaks
    }
  }
  

  private getAllUsers() {
    const headers = new HttpHeaders({
      Authorization: `${this.auth.token}`, // Include token in Authorization header
    });

    this.http
      .get<{ users: any[] }>('http://localhost:3000/users/allUsers', {
        headers,
      })
      .subscribe({
        next: (response) => {
          console.log('Data:', response);
          this.users = response.users.map((user) => ({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.isAdmin ? 'Admin' : 'User',
            password: user.password,
          }));
          // console.log('Mapped Users:', this.users);
          // this.user = this.users.find((user)=> user.email === this.auth.user.email);
    
          
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
      });
  }

  deleteUser(user: User) {
    const headers = new HttpHeaders({
      Authorization: `${this.auth.token}`, // Include token in Authorization header
    });
    const options = {
      headers: headers,
      body: { id: user.id }, // Specify the body for delete request
    };
    return this.http
      .delete(`http://localhost:3000/users/deleteUser`, options)
      .subscribe({
        next: (data) => {
          console.log('User deleted successfully:', data);
          // You can handle any post-deletion logic here, like updating the UI
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        },
      });
  }

  // getAllUsers() {
  //   const headers = new HttpHeaders({
  //     Authorization: `${this.auth.token}` // Include token in Authorization header
  //   });

  //   this.http.get('http://localhost:3000/users/allUsers', { headers }).subscribe({
  //     next: (data) => {
  //       console.log('Data:', data.valueOf());

  //     },
  //     error: (error) => {
  //       console.error('Error fetching users:', error);
  //     }
  //   });
  // }
  createUser(data: newUser) {
    const headers = new HttpHeaders({
      Authorization: `${this.auth.token}`, // Include token in Authorization header
    });
    const body = {
      name: data.name,
      password: data.password,
      isAdmin: data.role,
      email: data.email,
    };
    this.http
      .post('http://localhost:3000/users/createUser', body, { headers })
      .subscribe({
        next: (data) => {
          console.log('Data:', data);
          this.getAllUsers()
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
      });
  }

  updateUser(user: User) {
    const headers = new HttpHeaders({
      Authorization: `${this.auth.token}`, // Include token in Authorization header
    });
    const body = {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.role === 'Admin' ? true : false, // Assuming role is stored as 'Admin' or 'User'
      // Include any other fields you want to update
    };
    this.http
      .patch(`http://localhost:3000/users/updateUser`, body, { headers })
      .subscribe({
        next: (data) => {
          console.log('User updated successfully:', data);
          // You can handle any post-update logic here, like updating the UI
        },
        error: (error) => {
          console.error('Error updating user:', error);
        },
      });
  }
}
