import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IssuesService } from '../issues.service';
import { Router } from '@angular/router';
import { ProjectServiceService } from '../project-service.service';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

interface ChartData {
  name: string;
  value: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(
    public issues: IssuesService,
    private router: Router,
    public projects: ProjectServiceService
  ) {}

  chartData: ChartData[] = [];
  colorScheme: Color = {
    name: 'cool',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  ngOnInit() {
    // this.issues.getChartData().subscribe(data => {
    //   this.chartData = data;
    //   console.log(data);
    // });
    
    
  }

  redirect(entry: any) {
    this.issues.filteredIssues = this.issues.issues.filter(
      (issue) => issue.assigneeName.email === entry.key
    );
    this.router.navigate(['/issues']);
  }

  redirectProjects(entry: any) {
    this.issues.filteredIssues = this.issues.issues.filter((issue) => {
      return issue.project.title === entry.title;
    });
    this.projects.seletedProject = entry;
    this.router.navigate(['/issues']);
  }
}
