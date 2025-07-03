import { effect, inject, Injectable, signal } from '@angular/core';
import { Task } from '../models/task.model';
import { IndexedDBService } from './indexed-db.service';
import { Observable, tap } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly STORE_NAME = 'tasks';
  private readonly DATA_KEY = 'tasks-data';
  private db = inject(IndexedDBService);

  private _tasks = signal<Task[]>([]);
  public tasks = this._tasks.asReadonly();

  constructor() {
    this.loadInitialTasks();

    effect(() => {
      const currentTasks = this._tasks();
      this.db.saveAllTasks(currentTasks).subscribe();
    });
  }

  private loadInitialTasks(): void {
    this.db.getAllTasks().pipe(
      tap(tasks => this._tasks.set(tasks))
    ).subscribe();
  }

  addTask(task: Omit<Task, 'id' | 'completed' | 'createdAt'>): void {
    const newTask: Task = {
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date(),
      ...task
    };
    this._tasks.update(task => [...task, newTask]);
  };

  updateTask(id: string, updatedTask: Partial<Task>): void {
    this._tasks.update(tasks => 
      tasks.map(task => task.id === id ? {...task, ...updatedTask} : task)
    )
  };

  deleteTask(id: string): void {
    this._tasks.update(tasks => tasks.filter(t => t.id !== id));
  };

  getTaskById(id: string): Task | undefined  {
    return this._tasks().find(t => t.id === id);
  };
}