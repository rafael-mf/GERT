// gert-frontend/src/app/features/dashboard/pages/dashboard-home/dashboard-home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardService, DashboardStats, ChartData } from '../../../../core/services/dashboard.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NgxChartsModule, DatePipe]
})
export class DashboardHomeComponent implements OnInit {
  stats: DashboardStats | null = null;
  loading = true;
  error = '';

  // Filtros de período
  selectedPeriod: string = 'thisMonth';
  customStartDate: string = '';
  customEndDate: string = '';

  // Opções de período
  periodOptions = [
    { value: 'thisMonth', label: 'Este mês' },
    { value: 'last3Months', label: 'Últimos 3 meses' },
    { value: 'last6Months', label: 'Últimos 6 meses' },
    { value: 'thisYear', label: 'Este ano' },
    { value: 'lastYear', label: 'Ano passado' },
    { value: 'last2Years', label: 'Últimos 2 anos' },
    { value: 'custom', label: 'Período personalizado' }
  ];

  // Propriedades e opções para os gráficos
  pieChartData: ChartData[] = [];
  barChartData: ChartData[] = [];

  // Esquema de cores para os gráficos (pode ser personalizado)
  colorScheme: any = {
    domain: ['#0275d8', '#5cb85c', '#f0ad4e', '#d9534f', '#6c757d', '#292b2c']
  };

  constructor(
    private dashboardService: DashboardService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private calculateDateRange(): { startDate?: string, endDate?: string } {
    const today = new Date();
    const params: any = {};

    switch (this.selectedPeriod) {
      case 'thisMonth':
        const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        params.startDate = this.formatDate(thisMonthStart);
        params.endDate = this.formatDate(today);
        break;
      
      case 'last3Months':
        const last3MonthsStart = new Date(today.getFullYear(), today.getMonth() - 3, 1);
        params.startDate = this.formatDate(last3MonthsStart);
        params.endDate = this.formatDate(today);
        break;
      
      case 'last6Months':
        const last6MonthsStart = new Date(today.getFullYear(), today.getMonth() - 6, 1);
        params.startDate = this.formatDate(last6MonthsStart);
        params.endDate = this.formatDate(today);
        break;
      
      case 'thisYear':
        const thisYearStart = new Date(today.getFullYear(), 0, 1);
        params.startDate = this.formatDate(thisYearStart);
        params.endDate = this.formatDate(today);
        break;
      
      case 'lastYear':
        const lastYearStart = new Date(today.getFullYear() - 1, 0, 1);
        const lastYearEnd = new Date(today.getFullYear() - 1, 11, 31);
        params.startDate = this.formatDate(lastYearStart);
        params.endDate = this.formatDate(lastYearEnd);
        break;
      
      case 'last2Years':
        const last2YearsStart = new Date(today.getFullYear() - 2, 0, 1);
        params.startDate = this.formatDate(last2YearsStart);
        params.endDate = this.formatDate(today);
        break;
      
      case 'custom':
        if (this.customStartDate) params.startDate = this.customStartDate;
        if (this.customEndDate) params.endDate = this.customEndDate;
        break;
    }

    return params;
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  loadDashboardData(): void {
    this.loading = true;
    const params = this.calculateDateRange();

    this.dashboardService.getStats(params).subscribe({
      next: (data) => {
        this.stats = data;
        // Prepara os dados recebidos da API para o formato que os gráficos esperam
        this.pieChartData = data.chamadosPorStatus;
        this.barChartData = data.faturamentoMensal;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Falha ao carregar dados do dashboard.';
        this.toastr.error(this.error, 'Erro de API');
        console.error(err);
        this.loading = false;
      }
    });
  }

  onPeriodChange(): void {
    this.loadDashboardData();
  }

  applyCustomFilters(): void {
    if (this.selectedPeriod === 'custom') {
      this.loadDashboardData();
    }
  }

  resetToCurrentMonth(): void {
    this.selectedPeriod = 'thisMonth';
    this.customStartDate = '';
    this.customEndDate = '';
    this.loadDashboardData();
  }

  get selectedPeriodLabel(): string {
    const option = this.periodOptions.find(p => p.value === this.selectedPeriod);
    return option ? option.label : '';
  }

  // Função para formatar o eixo Y do gráfico de barras como moeda (BRL)
  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
