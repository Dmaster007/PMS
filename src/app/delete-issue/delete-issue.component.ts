import { TitleCasePipe } from '@angular/common';
import { Component, Pipe, inject, model } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef  } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-issue',
  standalone: true,
  imports: [MatDialogModule ,ReactiveFormsModule ,TitleCasePipe],
  templateUrl: './delete-issue.component.html',
  styleUrl: './delete-issue.component.css'
})
export class DeleteIssueComponent {
  readonly dialogRef = inject(MatDialogRef<DeleteIssueComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  // readonly animal = model(this.data.animal);
  // isConfirm = false

  onNoClick(): void {
    this.dialogRef.close(false);
  }
  confirmed(){
    this.dialogRef.close(true)
  }
}
