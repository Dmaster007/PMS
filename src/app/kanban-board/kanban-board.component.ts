import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Issue, IssuesService } from '../issues.service';
import { ProjectServiceService } from '../project-service.service';

interface KanbanItem {
  id: number;
  title: string;
  status: string;
}

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.css'],
})
export class KanbanBoardComponent implements OnInit {
  // items: KanbanItem[] = [
  //   { id: 1, title: 'Task 1', status: 'todo' },
  //   { id: 2, title: 'Task 2', status: 'todo' },
  //   { id: 3, title: 'Task 3', status: 'inProgress' },
  //   { id: 4, title: 'Task 4', status: 'done' },
  // ];
  constructor(private Issues : IssuesService , public ProjectService :ProjectServiceService){

  }
  items :Issue[] =[];
  todoItems: Issue[] = [];
  inProgressItems: Issue[] = [];
  doneItems: Issue[] = [];
  draggingItem: Issue | null = null;

  ngOnInit() {
    setTimeout(()=>{
      if(this.ProjectService.seletedProject!==null){
        this.items = this.Issues.filteredIssues;
      }
      else{
        this.items = this.Issues.issues;
      }
      this.filterItems()
    },100)
    
  }

  onDragStart(event: DragEvent, item: Issue) {
    this.draggingItem = item;
  }
  onDragOver(event:DragEvent){
    event.preventDefault()
  }

  filterItems(){
    this.todoItems = this.items.filter(item => item.status === 'todo' && item.status);
    this.inProgressItems = this.items.filter(item => item.status === 'inProgress' &&  item.status);
    this.doneItems = this.items.filter(item => item.status === 'done' && item.status);
  }

  onDragEnd(event: DragEvent , status :string) {
    
    const item = this.items.find((item)=> item.id === this.draggingItem?.id)
    if(item && item!==undefined){
      item.status = status;
    }
    this.Issues.updateIssue(item)
    this.filterItems()
    this.draggingItem = null;
  }
}
