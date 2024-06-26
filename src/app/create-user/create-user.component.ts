import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {
  userForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CreateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private usersService: UsersService
  ) {
    this.userForm = new FormGroup({
      name: new FormControl(data.name || '', Validators.minLength(3)),
      email: new FormControl(data.email || '', Validators.email),
      role: new FormControl(data.role || ''),
      password: new FormControl(data.password || '', Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm))
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit(event: Event): void {
    event.preventDefault();
    if (this.userForm.valid) {
      this.dialogRef.close(this.userForm.value);
    }
  }
}
