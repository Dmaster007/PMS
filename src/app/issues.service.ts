import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth0ApiService } from './auth0-service.service';
import User from './users/user';
import Project from './issues/issues.component';
import { ProjectServiceService } from './project-service.service';
import { Observable, of } from 'rxjs';

export interface Issue {
  id: string;
  title: string;
  content: string;
  progress: number; // Assuming progress is represented as a number (e.g., 0-100%)
  priority: string; // Could be 'low', 'medium', 'high', etc.
  startDate: string; // Use Date type if using actual dates
  dueDate: string; // Use Date type if using actual dates // Assuming assignee is represented by user ID
  assigneeName: User; // Display name of the assignee
  category: string;
  status?:string;
  project : Project;
}
interface ChartData {
  name: string;
  value: number;
}
// export interface AssigObj {
//   assigne:User,
//   currentValue:number;
// }
@Injectable({
  providedIn: 'root',
})
export class IssuesService {
  selectedProject : Project | null = null ;
  filteredIssues: Issue[] = [];
  issues: Issue[] = [
    // {
    //   id: '1',
    //   title: 'Bug in Login Page',
    //   content: 'Users unable to login, getting authentication errors.',
    //   progress: 50,
    //   priority: 'high',
    //   startDate: '2024-06-21',
    //   dueDate: '2024-06-30',
    //   assigneeName: 'John Doe',
    //   category: 'Bug',
    // },
    // {
    //   id: '2',
    //   title: 'Feature Request: Dark Mode',
    //   content: 'Implement dark mode feature for better user experience.',
    //   progress: 10,
    //   priority: 'medium',
    //   startDate: '2024-06-22',
    //   dueDate: '2024-07-15',
    //   assigneeName: 'Jane Smith',
    //   category: 'Feature',
    // },
    // {
    //   id: '3',
    //   title: 'Database Optimization',
    //   content: 'Improve database queries for faster response times.',
    //   progress: 75,
    //   priority: 'high',
    //   startDate: '2024-06-20',
    //   dueDate: '2024-07-10',
    //   assigneeName: 'Alice Johnson',
    //   category: 'Improvement',
    // },
  ];
  constructor(private http: HttpClient, private auth: Auth0ApiService , private ProjectService : ProjectServiceService) {
    // setTimeout(()=>{
    this.getAllIssues();
    this.selectedProject = ProjectService.seletedProject
    this.assignIssues()
    
    console.log(this.mappedIssues);
    
    // },2000)
  }
  private baseUrl = 'http://localhost:3000/issues';
  public mappedIssues = new Map<string, any>();

  private assignIssues() {
    for (let i = 0; i < this.issues.length; i++) {
      const currentUser = this.issues[i].assigneeName.email;

      if (currentUser) {
        const existingEntry = this.mappedIssues.get(currentUser) || {
          currentValue: 0,
          assignee: this.issues[i].assigneeName,
        };
        const currentObject = {
          currentValue: existingEntry.currentValue + 1,
          assignee: this.issues[i].assigneeName,
        };
        this.mappedIssues.set(currentUser, currentObject);
      }
    }

    this.getChartData()
  }
  chartData:any;
  
  getChartData() {
    this.chartData = Array.from(this.mappedIssues.values()).map(issue => ({
      name: issue.assignee.name,
      value: issue.currentValue
    })).sort((a, b) => b.value - a.value);;
    
    
    
  }
  addIssue(data: any) {
    const headers = new HttpHeaders({
      Authorization: `${this.auth.token}`, // Include token in Authorization header
    });
    
    
    const body = {
      title: data.title,
      content: data.content,
      priority: data.priority,
      startDate: data.startDate,
      dueDate: data.dueDate,
      assignee: data.assignee,
      category: data.category,
      progress: data.progress,
      project:data.project
    };
    // console.log(data.assignee);
    
    this.http
      .post('http://localhost:3000/issues/createIssue', body, { headers })
      .subscribe({
        next: (data) => {
          console.log('Data:', data);
          this.getAllIssues();
          
          
          
          // this.issues.push(data);
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
      });
  }

  // Function to update an existing issue
  updateIssue(data: any) {
    const headers = new HttpHeaders({
      Authorization: `${this.auth.token}`,
    });
    const body = {
      title: data.title,
      content: data.content,
      priority: data.priority,
      startDate: data.startDate,
      dueDate: data.dueDate,
      assignee: data.assignee,
      category: data.category,
      progress: data.progress,
      status : data.status,
    };
    this.http
      .put(`http://localhost:3000/issues/updateIssue/${data.id}`, body, {
        headers,
      })
      .subscribe({
        next: (response) => {
          console.log('Issue updated successfully:', response);
          this.getAllIssues(); // Fetch the updated list of issues
        },
        error: (error) => {
          console.error('Error updating issue:', error);
        },
      });
  }

  // Function to delete an issue by ID
  deleteIssue(issuem: any) {
    const headers = new HttpHeaders({
      Authorization: `${this.auth.token}`, // Include token in Authorization header
    });

    const options = {
      headers: headers, // Specify the body for delete request
    };

    this.http
      .delete(`${this.baseUrl}/deleteIssue/${issuem.id}`, options)
      .subscribe({
        next: (data) => {
          console.log('Issue deleted successfully:', data);
          // Handle any post-deletion logic here, like updating the UI
          this.issues = this.issues.filter((issue) => issue.id !== issuem.id);
          this.filteredIssues = this.filteredIssues.filter(
            (issue) => issue.id !== issuem.id
          );
        },
        error: (error) => {
          console.error('Error deleting issue:', error);
        },
      });
  }

  // Function to fetch all issues
  getAllIssues() {
    const headers = new HttpHeaders({
      Authorization: `${this.auth.token}`, // Include token in Authorization header
    });

    this.http
      .get<{ issues: any[] }>('http://localhost:3000/issues/getAllUsers', {
        headers,
      })
      .subscribe({
        next: (response) => {
          console.log('Fetched Issues:', response);
          this.issues = response.issues.map((issue: any) => ({
            id: issue._id,
            title: issue.title.trim().substring(0, issue.title.length - 64),
            content: issue.content,
            progress: issue.progress,
            priority: issue.priority,
            startDate: issue.startDate,
            dueDate: issue.dueDate, // Assuming assignee is an object with an _id property
            assigneeName: issue.assignee, // Assuming assignee has a name property
            category: issue.category,
            status:issue.status,
            project:issue.project
          }));
          console.log('Mapped Issues:', this.issues);
          if(this.ProjectService.seletedProject!==null && this.ProjectService.seletedProject){
          this.filteredIssues = this.issues.filter((issue) => {
              // console.log('Comparing project IDs:', issue.project.id, entry.id); // Log the project IDs being compared
              return issue.project.title === this.ProjectService.seletedProject.title;
            });
          }
          else{
            this.filteredIssues = this.issues;
          }
          this.assignIssues();
        },
        error: (error) => {
          console.error('Error fetching issues:', error);
        },
      });
  }
  // Function to find an issue by ID
  getIssueById(id: string) {
    return this.issues.find((issue) => issue.id === id);
  }
}
