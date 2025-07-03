import { Component, inject, Inject, Input } from '@angular/core';
import { Task } from '../../core/models/task.model';
import { TaskFormComponent } from "../../shared/task-form/task-form.component";
import { TaskService } from '../../core/services/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-edit-task',
  imports: [TaskFormComponent],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.scss',
  standalone: true
})
export class EditTaskComponent {
  private taskService = inject(TaskService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  task: Task | null = null;

  ngOnInit() {
    const taskId = this.route.snapshot.params['id'];
    const foundTask = this.taskService.getTaskById(taskId);

    if (!foundTask) {
      console.error(`Задача с ID ${taskId} не найдена`);
      return;
    }
    
    this.task = foundTask;
  }

  updateTask(updatedTask: Omit<Task, 'id' | 'createdAt'>) {
    if (this.task) {
      this.taskService.updateTask(this.task.id, updatedTask);
      this.router.navigate(['/']);
    }
  }

  navigateBack() {
    this.router.navigate(['/']);
  }
}