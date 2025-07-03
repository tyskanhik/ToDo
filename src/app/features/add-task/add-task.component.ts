import { Component, inject } from '@angular/core';
import { TaskFormComponent } from '../../shared/task-form/task-form.component';
import { Router } from '@angular/router';
import { TaskService } from '../../core/services/task.service';
import { Task } from '../../core/models/task.model';


@Component({
  selector: 'app-add-task',
  imports: [TaskFormComponent],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
  standalone: true
})
export class AddTaskComponent {
  private taskService = inject(TaskService);
  private router = inject(Router);


  addTask(task: Omit<Task, 'id' | 'comlition'>) {
    this.taskService.addTask(task)
    this.router.navigate(['/'])
  }

  navigateBack() {
    this.router.navigate(['/']);
  }
}