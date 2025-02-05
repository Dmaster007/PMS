import { Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { IssuesComponent } from './issues/issues.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { KanbanBoardComponent } from './kanban-board/kanban-board.component';

export const routes: Routes = [
    {path:'users' , component:UsersComponent},
    {path:'issues' , component:IssuesComponent},
    {path:'' , component:DashboardComponent},
    {path:'projects',component:CreateProjectComponent},
    {path:'project_id/kanban' , component:KanbanBoardComponent}
];
