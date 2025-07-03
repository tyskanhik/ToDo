import { Component, inject } from '@angular/core';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  imports: [],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss',
  standalone: true
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);
  
  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
