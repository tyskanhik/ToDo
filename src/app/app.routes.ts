import { Routes } from '@angular/router';
import { TaskListComponent } from './features/task-list/task-list.component';
import { AddTaskComponent } from './features/add-task/add-task.component';
import { EditTaskComponent } from './features/edit-task/edit-task.component';
import { NotFoundComponent } from './features/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full'
  },
  {
    path: 'tasks',
    component: TaskListComponent
  },
  {
    path: 'tasks/add',
    component: AddTaskComponent
  },
  { 
    path: 'tasks/:id', 
    component: EditTaskComponent 
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];
