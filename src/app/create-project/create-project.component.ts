import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  MatChipInputEvent,
  MatChipEditedEvent,
  MatChipsModule,
} from '@angular/material/chips';
import User from '../users/user';
import { UsersService } from '../users.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProjectServiceService } from '../project-service.service';
@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
  ],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.css',
})
export class CreateProjectComponent {
  projectForm;
  data = { title: 'Create Project' };
  filteredUsers: User[] = this.users.users;
  selectedMembers: User[] = [];
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  memberSearch = new FormControl<string>('');
  constructor(
    private fb: FormBuilder,
    public users: UsersService,
    private projects: ProjectServiceService
  ) {
    
    
    this.projectForm = new FormGroup({
      projectName: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      members: new FormControl<User[] | null>(null),
    });
    setTimeout(()=>{
      this.filteredUsers = this.users.users;
    },500) 
    
  }

  // ngOnInit(): void {
  //   this.projectForm = this.fb.group({
  //     projectName: ['', Validators.required],
  //     description: ['', Validators.required],
  //     members: [null, Validators.required]
  //   });
  // }
  
  addMember(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    const user = this.filteredUsers.find((u) => u.email === value);
    if (user && !this.selectedMembers.includes(user)) {
      this.selectedMembers.push(user);
    }
    event.chipInput!.clear();
    
    
  }

  removeMember(member: User): void {
    const index = this.selectedMembers.indexOf(member);
    if (index >= 0) {
      this.selectedMembers.splice(index, 1);
    }
  }

  // editMember(member: User, event: MatChipEditedEvent) {
  //   const value = event.value.trim();
  //   if (!value) {
  //     this.removeMember(member);
  //     return;
  //   }
  //   const user = this.filteredUsers.find(u => u.email === value);
  //   if (user && !this.selectedMembers.includes(user)) {
  //     const index = this.selectedMembers.indexOf(member);
  //     if (index >= 0) {
  //       this.selectedMembers[index] = user;
  //     }
  //   }
  // }

  filterMembers(event: Event): void {
    const searchText = (event.target as HTMLInputElement).value;
    this.filteredUsers = this.users.users.filter((user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  addMemberFromSelect(event: Event): void {
    const selectedUserId = (event.target as HTMLSelectElement).value;
    const user = this.users.users.find(
      (u) => u.id.toString() === selectedUserId.toString()
    );
    if (user && !this.selectedMembers.includes(user)) {
      this.selectedMembers.push(user);
    }
    this.memberSearch.reset()
    // console.log(this.memberSearch);
  }

  submit(event: Event): void {
    console.log('hello');
    if (this.projectForm.valid) {
      // Handle form submission
      this.projectForm.value.members = this.selectedMembers;
      this.projects.createProject(this.projectForm.value)
      this.projectForm.reset()
    }
  }

  commaSeparatedEmailsValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const emails = control.value
      .split(',')
      .map((email: string) => email.trim());
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const valid = emails.every((email: string) => emailPattern.test(email));
    return valid ? null : { invalidEmails: true };
  }
}
