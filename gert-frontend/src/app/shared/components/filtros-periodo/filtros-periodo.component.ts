// gert-frontend/src/app/shared/components/filtros-periodo/filtros-periodo.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FiltrosPeriodo {
  startDate?: string;
  endDate?: string;
  periodo?: string;
}

@Component({
  selector: 'app-filtros-periodo',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  template: `
    <div class="card border-0 shadow-sm mb-4">
      <div class="card-header bg-gradient bg-light border-0 py-3">
        <h6 class="mb-0 fw-semibold">
          <i class="fas fa-filter me-2 text-primary"></i>Filtros de Período
        </h6>
      </div>
      <div class="card-body p-4">
        <div class="row g-3 align-items-end">
          <div class="col-md-6">
            <label for="periodSelect" class="form-label fw-medium">
              <i class="fas fa-calendar-alt me-2 text-muted"></i>Período
            </label>
            <select class="form-select form-select-lg border-0 shadow-sm" id="periodSelect" [(ngModel)]="selectedPeriod" 
                    (change)="onPeriodChange()" name="selectedPeriod">
              <option *ngFor="let option of periodOptions" [value]="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Campos personalizados (aparecem apenas quando "Período personalizado" está selecionado) -->
          <div *ngIf="selectedPeriod === 'custom'" class="col-md-6">
            <div class="row g-2">
              <div class="col-6">
                <label for="customStartDate" class="form-label fw-medium">
                  <i class="fas fa-calendar me-1 text-success"></i>Data Inicial
                </label>
                <input type="date" class="form-control border-0 shadow-sm" id="customStartDate" 
                       [(ngModel)]="customStartDate" name="customStartDate">
              </div>
              <div class="col-6">
                <label for="customEndDate" class="form-label fw-medium">
                  <i class="fas fa-calendar me-1 text-danger"></i>Data Final
                </label>
                <input type="date" class="form-control border-0 shadow-sm" id="customEndDate" 
                       [(ngModel)]="customEndDate" name="customEndDate">
              </div>
            </div>
          </div>

          <div class="col-md-6" [class.col-md-12]="selectedPeriod !== 'custom'">
            <div class="d-flex gap-2 justify-content-end">
              <button *ngIf="selectedPeriod === 'custom'" type="button" class="btn btn-primary shadow-sm px-4" 
                      (click)="applyCustomFilters()">
                <i class="fas fa-filter me-2"></i>Aplicar
              </button>
              <button type="button" class="btn btn-outline-secondary" (click)="resetToCurrentMonth()">
                <i class="fas fa-redo me-2"></i>Este Mês
              </button>
            </div>
          </div>
        </div>

        <!-- Indicador do período selecionado -->
        <div class="mt-3 p-2 bg-light rounded">
          <small class="text-muted">
            <i class="fas fa-info-circle me-2"></i>
            <strong>Período ativo:</strong> 
            <span *ngIf="selectedPeriod !== 'custom'">
              {{ selectedPeriodLabel }}
            </span>
            <span *ngIf="selectedPeriod === 'custom' && customStartDate && customEndDate">
              {{ customStartDate | date:'dd/MM/yyyy' }} até {{ customEndDate | date:'dd/MM/yyyy' }}
            </span>
            <span *ngIf="selectedPeriod === 'custom' && (!customStartDate || !customEndDate)">
              Período personalizado (defina as datas)
            </span>
          </small>
        </div>
      </div>
    </div>
  `
})
export class FiltrosPeriodoComponent {
  @Input() selectedPeriod: string = 'thisMonth';
  @Output() filtroChange = new EventEmitter<FiltrosPeriodo>();

  customStartDate: string = '';
  customEndDate: string = '';

  periodOptions = [
    { value: 'thisMonth', label: 'Este mês' },
    { value: 'last3Months', label: 'Últimos 3 meses' },
    { value: 'last6Months', label: 'Últimos 6 meses' },
    { value: 'thisYear', label: 'Este ano' },
    { value: 'lastYear', label: 'Ano passado' },
    { value: 'last2Years', label: 'Últimos 2 anos' },
    { value: 'custom', label: 'Período personalizado' }
  ];

  private calculateDateRange(): FiltrosPeriodo {
    const today = new Date();
    const filters: FiltrosPeriodo = { periodo: this.selectedPeriod };

    switch (this.selectedPeriod) {
      case 'thisMonth':
        const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        filters.startDate = this.formatDate(thisMonthStart);
        filters.endDate = this.formatDate(today);
        break;
      
      case 'last3Months':
        const last3MonthsStart = new Date(today.getFullYear(), today.getMonth() - 3, 1);
        filters.startDate = this.formatDate(last3MonthsStart);
        filters.endDate = this.formatDate(today);
        break;
      
      case 'last6Months':
        const last6MonthsStart = new Date(today.getFullYear(), today.getMonth() - 6, 1);
        filters.startDate = this.formatDate(last6MonthsStart);
        filters.endDate = this.formatDate(today);
        break;
      
      case 'thisYear':
        const thisYearStart = new Date(today.getFullYear(), 0, 1);
        filters.startDate = this.formatDate(thisYearStart);
        filters.endDate = this.formatDate(today);
        break;
      
      case 'lastYear':
        const lastYearStart = new Date(today.getFullYear() - 1, 0, 1);
        const lastYearEnd = new Date(today.getFullYear() - 1, 11, 31);
        filters.startDate = this.formatDate(lastYearStart);
        filters.endDate = this.formatDate(lastYearEnd);
        break;
      
      case 'last2Years':
        const last2YearsStart = new Date(today.getFullYear() - 2, 0, 1);
        filters.startDate = this.formatDate(last2YearsStart);
        filters.endDate = this.formatDate(today);
        break;
      
      case 'custom':
        if (this.customStartDate) filters.startDate = this.customStartDate;
        if (this.customEndDate) filters.endDate = this.customEndDate;
        break;
    }

    return filters;
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  onPeriodChange(): void {
    if (this.selectedPeriod !== 'custom') {
      this.emitFilters();
    }
  }

  applyCustomFilters(): void {
    if (this.selectedPeriod === 'custom') {
      this.emitFilters();
    }
  }

  resetToCurrentMonth(): void {
    this.selectedPeriod = 'thisMonth';
    this.customStartDate = '';
    this.customEndDate = '';
    this.emitFilters();
  }

  private emitFilters(): void {
    const filters = this.calculateDateRange();
    this.filtroChange.emit(filters);
  }

  get selectedPeriodLabel(): string {
    const option = this.periodOptions.find(p => p.value === this.selectedPeriod);
    return option ? option.label : '';
  }
}