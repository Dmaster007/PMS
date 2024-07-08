import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IssuesService } from '../issues.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(public issues: IssuesService , private router:Router){

  }

  redirect(entry :any ){
    this.issues.filteredIssues = this.issues.issues.filter((issue)=>issue.assigneeName.email === entry.key)
    this.router.navigate(['/issues']);
    // console.log(this.issues.filteredIssues);
    
  }
}
