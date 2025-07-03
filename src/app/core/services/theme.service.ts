import { effect, inject, Injectable, signal } from '@angular/core';
import { Storaje } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'todo-app-theme';
  private storage = inject(Storaje);
  
  currentTheme = signal<'light' | 'dark'>(
    this.storage.get<'light' | 'dark'>(this.THEME_KEY) || 'light'
  );

  constructor() { 
    effect(() => {
      const theme = this.currentTheme();
      this.applyTheme(theme);
      this.storage.set(this.THEME_KEY, theme as never);
    });
  }

  private applyTheme(theme: 'light' | 'dark') {
    document.documentElement.setAttribute('todo-data-theme', theme);
  }

  toggleTheme() {
    this.currentTheme.update(theme => 
      theme === 'light' ? 'dark' : 'light'
    );
  }
}
