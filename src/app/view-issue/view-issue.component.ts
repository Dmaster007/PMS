import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-view-issue',
  standalone: true,
  imports: [MatDialogModule ,JsonPipe],
  templateUrl: './view-issue.component.html',
  styleUrl: './view-issue.component.css'
})
export class ViewIssueComponent {
  readonly data = inject<any>(MAT_DIALOG_DATA);
}
