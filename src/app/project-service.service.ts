import { Injectable } from '@angular/core';
import Project from './issues/issues.component';
import { AuthService, User } from '@auth0/auth0-angular';
import { UsersService } from './users.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth0ApiService } from './auth0-service.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectServiceService {
  projects: any = [];
  seletedProject : any = null
  getDemoProjects(): Project[] {
    // const users: User[] = [
    //   { id: '1', name: 'User One', email: 'userone@example.com', role: 'User' },
    //   { id: '2', name: 'User Two', email: 'usertwo@example.com', role: 'User' },
    //   { id: '3', name: 'User Three', email: 'userthree@example.com', role: 'Admin' },
    //   { id: '4', name: 'User Four', email: 'userfour@example.com', role: 'User' },
    // ];

    const projects: Project[] = [
      {
        id: '1',
        title: 'Project One',
        lead: this.users.users[0],
        members: [this.users.users[1], this.users.users[2]],
        desc: 'Description for project one'
      },
      {
        id: '2',
        title: 'Project Two',
        lead: this.users.users[1],
        members: [this.users.users[0], this.users.users[3]],
        desc: 'Description for project two'
      },
      {
        id: '3',
        title: 'Project Three',
        lead: this.users.users[2],
        members: [this.users.users[1], this.users.users[3]],
        desc: 'Description for project three'
      }
    ];

    return projects;
  }
  constructor(private users : UsersService , private  auth : Auth0ApiService , private http :HttpClient) { 
    this.getAllprojects()
  }

  private getAllprojects() {
    const headers = new HttpHeaders({
      Authorization: `${this.auth.token}`, // Include token in Authorization header
    });
  
    this.http
      .get<any[]>('http://localhost:3000/projects/getProjects', {
        headers,
      })
      .subscribe({
        next: (response) => {
          // console.log('Data-project:', response);
  
          this.projects = response.map((project) => ({
            id: project._id,
            title: project.title,
            desc: project.desc,
            members: project.members,
            lead: project.lead,
          }));
          
          // console.log('Mapped Projects:', this.projects);
        },
        error: (error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }
  

  createProject(data: any) {
    const headers = new HttpHeaders({
      Authorization: `${this.auth.token}`, // Include token in Authorization header
    });
    const body = {
      title: data.projectName,
      desc: data.description,
      members: data.members.map((member: any) => member.id),
    };
    console.log(body);
    
    this.http
      .post('http://localhost:3000/projects/createProject', body, { headers })
      .subscribe({
        next: (data) => {
          console.log('Data:', data);
          // this.getAllUsers()
          
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
      });
  }
}
