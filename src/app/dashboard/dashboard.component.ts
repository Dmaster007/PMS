import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IssuesService } from '../issues.service';
import { Router } from '@angular/router';
import { ProjectServiceService } from '../project-service.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  constructor(
    public issues: IssuesService,
    private router: Router,
    public projects: ProjectServiceService
  ) {}
  redirect(entry: any) {
    this.issues.filteredIssues = this.issues.issues.filter(
      (issue) => issue.assigneeName.email === entry.key
    );
    this.router.navigate(['/issues']);
    // console.log(this.issues.filteredIssues);
  }
  redirectProjects(entry: any) {
    // console.log('Project Entry:', entry); // Log the project entry
    // console.log('All Issues:', this.issues.issues); // Log all issues

    this.issues.filteredIssues = this.issues.issues.filter((issue) => {
      // console.log('Comparing project IDs:', issue.project.id, entry.id); // Log the project IDs being compared
      return issue.project.title === entry.title;
    });
    this.projects.seletedProject = entry
    // console.log('Filtered Issues:', this.issues.filteredIssues); // Log filtered issues

    // Uncomment this line to navigate to the issues page if needed
    this.router.navigate(['/issues']);
  }
}
