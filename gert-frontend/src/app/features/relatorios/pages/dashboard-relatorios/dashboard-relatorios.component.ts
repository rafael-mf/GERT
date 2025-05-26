import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-relatorios',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-relatorios.component.html',
  styleUrl: './dashboard-relatorios.component.scss'
})
export class DashboardRelatoriosComponent {}
