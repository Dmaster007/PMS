import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Issue, IssuesService } from '../issues.service';
import { CreateIssuesComponent } from '../create-issues/create-issues.component';
import { MatDialog } from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { DeleteIssueComponent } from '../delete-issue/delete-issue.component';
import { ViewIssueComponent } from '../view-issue/view-issue.component';
import {MatIconModule} from '@angular/material/icon';
import User from '../users/user';
import { ProjectServiceService } from '../project-service.service';
import { Color, NgxChartsModule, ScaleType,} from '@swimlane/ngx-charts';
export default interface Project{
  id:String,
  title:String,
  desc:String,
  lead:User,
  members : User[]
}

@Component({
  selector: 'app-issues',
  standalone: true,
  imports: [MatIconModule,NgxChartsModule, CommonModule,CreateIssuesComponent,MatExpansionModule ,ReactiveFormsModule,MatProgressSpinnerModule],
  templateUrl: './issues.component.html',
  styleUrl: './issues.component.css'
})
export class IssuesComponent {
  constructor(public issuesService : IssuesService , public projectService : ProjectServiceService){
    
    setTimeout(()=>{
      this.updatePieChartData();
    },500)
    
  }
  readonly dialog = inject(MatDialog);
  readonly panelOpenState = signal(false);
  priority = new FormControl('');
  progress = new FormControl<string>('');
  category = new FormControl('');
  isPanelOpen = false;
  
  pieChartData: any[] = [];
  legendposition =  'below'


  colorScheme: Color = {
    name: 'cool',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [ '#A10A28','#C7B42C','#5AA454', '#AAAAAA']
  };
  updatePieChartData() {
    const notStartedCount = this.issuesService.filteredIssues.filter(issue => issue.status === 'todo').length;
    const inProgressCount = this.issuesService.filteredIssues.filter(issue => issue.status === 'inProgress').length;
    const doneCount = this.issuesService.filteredIssues.filter(issue => issue.status === 'done').length;

    this.pieChartData = [
      { name: 'not started', value: notStartedCount },
      { name: 'in progress', value: inProgressCount },
      { name: 'done', value: doneCount }
    ];

    console.log(this.pieChartData);
    
  }

  toggleAccordion(panelId: string): void {
    this.isPanelOpen = !this.isPanelOpen;
  }
  openDialog1(issue:any): void {
    const dialogRef = this.dialog.open(DeleteIssueComponent, {
      data: {name: 'Issue'},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result === true) {
        this.issuesService.deleteIssue(issue)
      }
    });
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(CreateIssuesComponent, {
      data: {action:'Create', animal:"bolo" },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined && result) {
      //  console.log(result);
       this.issuesService.addIssue(result)
      }
    });
  }
  toggledIssue_id = '';
  toggleActions(issue:any){
    if(this.toggledIssue_id !== ''){
      this.toggledIssue_id=''
    }
    else{
      this.toggledIssue_id = issue.id
    }
  }

  openDialogUpdate(issue:Issue): void {
    const dialogRef = this.dialog.open(CreateIssuesComponent, {
      data: {action:'Edit',...issue},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined && result) {
      //  console.log(result);
       this.issuesService.updateIssue({issue_id: issue.id , result})
      }
    });
  }
    openDialog3(issue:any): void {
    const dialogRef = this.dialog.open(ViewIssueComponent, {
      data: {issue},
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      // if (result !== undefined && result) {
      // //  console.log(result);
      //  this.issuesService.addIssue(result)
      // }
    });
  }
  
  applyfilters() {
    const selectedPriority = this.priority.value;
    const selectedProgress = this.progress.value;
    const selectedCategory = this.category.value;

    this.issuesService.filteredIssues = this.issuesService.issues.filter(issue => {
      const matchesPriority = selectedPriority ? issue.priority === selectedPriority : true;
      const matchesProgress = selectedProgress ? issue.progress.toString() === selectedProgress : true;
      const matchesCategory = selectedCategory ? issue.category === selectedCategory : true;
      this.updatePieChartData()
      return matchesPriority && matchesProgress && matchesCategory;
    });
  }

}
