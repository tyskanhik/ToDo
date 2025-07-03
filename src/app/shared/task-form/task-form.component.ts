import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../core/models/task.model';

interface TaskForm {
  title: FormControl<string | null>;
  description: FormControl<string | null>;
  completed: FormControl<boolean | null>;
}

@Component({
  selector: 'app-task-form',
  imports: [ ReactiveFormsModule ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
  standalone: true
})
export class TaskFormComponent {
  @Input() set task(value: Task | null) {
    if (value) {
      this.form.patchValue(value);
    }
  }
  
  @Input() submitText = 'Создать';
  @Input() showCompletion = false;
  
  @Output() submitForm = new EventEmitter<Omit<Task, 'id' | 'createdAt'>>();
  @Output() cancel = new EventEmitter<void>();

  form = new FormGroup<TaskForm>({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl(''),
    completed: new FormControl(false)
  });

  get titleControl() {
    return this.form.get('title');
  }

  onSubmit() {
    if (this.form.valid) {
      this.submitForm.emit({
        title: this.form.value.title!,
        description: this.form.value.description || '',
        completed: this.form.value.completed!
      })
    }
  }
}
