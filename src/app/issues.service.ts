import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth0ApiService } from './auth0-service.service';
import User from './users/user';
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
}

// export interface AssigObj {
//   assigne:User,
//   currentValue:number;
// }
@Injectable({
  providedIn: 'root',
})
export class IssuesService {
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
  constructor(private http: HttpClient, private auth: Auth0ApiService) {
    // setTimeout(()=>{
    this.getAllIssues();
    // },2000)
  }
  private baseUrl = 'http://localhost:3000/issues';
  mappedIssues: Map<any, any> = new Map();

  assignIssues() {
    for (let i = 0; i < this.issues.length; i++) {
      const currentUser = this.issues[i].assigneeName.email;

      if (currentUser) {
        // Ensure the issue exists in mappedIssues and initialize it to zero if it doesn't
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
    // console.log(this.mappedIssues);
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
    };
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
    };
    this.http
      .put(`http://localhost:3000/issues/updateIssue/${data.issue_id}`, body, {
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
          }));
          // console.log('Mapped Issues:', this.issues);
          this.filteredIssues = this.issues;
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
