import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IssuesService } from '../issues.service';
import { DialogModule } from '@angular/cdk/dialog';
import { MatIconModule } from '@angular/material/icon';
import { UsersService } from '../users.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-create-issues',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    MatDialogModule,
    MatIconModule,
  ],
  templateUrl: './create-issues.component.html',
  styleUrl: './create-issues.component.css',
})
export class CreateIssuesComponent implements OnInit,OnDestroy {
  issueForm: FormGroup;
  categories = ['Bug', 'Feature', 'Improvement'];
  priorities = ['Low', 'Medium', 'High'];
  progressOptions = [0, 25, 50, 75, 100];
  filteredUsers: any = this.users.users.filter((user)=> user.role!== 'Admin');
  private subscription: Subscription = new Subscription();
  constructor(
    public dialogRef: MatDialogRef<CreateIssuesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private issuesService: IssuesService,
    private users: UsersService
  ) {
    this.issueForm = new FormGroup({
      title: new FormControl(data.title || '', Validators.required),
      content: new FormControl(data.content || '', Validators.required),
      category: new FormControl(data.category || '', Validators.required),
      priority: new FormControl(data.priority || '', Validators.required),
      progress: new FormControl(data.progress || '', Validators.required),
      startDate: new FormControl(data.startDate || '', Validators.required),
      dueDate: new FormControl(data.dueDate || '', Validators.required),
      assignee : new FormControl(data.assignee|| '', Validators.required),
      assigneeSearch: new FormControl(''),
    });
  }
  ngOnInit(): void {
    const assigneeSearchControl = this.issueForm.get('assigneeSearch');
    if (assigneeSearchControl) {
      this.subscription.add(
        assigneeSearchControl.valueChanges.subscribe(value => {
          this.filterUsers(value);
        })
      );
    }
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  filterUsers(searchText: string): void {
    this.filteredUsers = this.users.users.filter(user =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) && user.role!== 'Admin'
    );
  }
  submit(event: Event): void {
    event.preventDefault();
    if (this.issueForm.valid) {
      this.dialogRef.close(this.issueForm.value);
    }
  }
}
