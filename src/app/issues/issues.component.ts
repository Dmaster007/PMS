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
  imports: [MatIconModule, CommonModule,CreateIssuesComponent,MatExpansionModule ,ReactiveFormsModule,MatProgressSpinnerModule],
  templateUrl: './issues.component.html',
  styleUrl: './issues.component.css'
})
export class IssuesComponent {
  constructor(public issuesService : IssuesService , public projectService : ProjectServiceService){
    
  }
  readonly dialog = inject(MatDialog);
  readonly panelOpenState = signal(false);
  priority = new FormControl('');
  progress = new FormControl<string>('');
  category = new FormControl('');
  isPanelOpen = false;
  
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
      data: {action:'Create', animal:"bolo" , project: this.projectService.seletedProject.id},
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

      return matchesPriority && matchesProgress && matchesCategory;
    });
  }

}
