import { Routes } from '@angular/router';

export const RELATORIOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/dashboard-relatorios/dashboard-relatorios.component').then(m => m.DashboardRelatoriosComponent),
    data: { roles: ['Administrador'] }
  },
  {
    path: 'chamados',
    loadComponent: () =>
      import('./pages/relatorio-chamados/relatorio-chamados.component').then(m => m.RelatorioChamadosComponent),
    data: { roles: ['Administrador'] }
  },
  {
    path: 'financeiro',
    loadComponent: () =>
      import('./pages/relatorio-financeiro/relatorio-financeiro.component').then(m => m.RelatorioFinanceiroComponent),
    data: { roles: ['Administrador'] }
  },
  {
    path: 'tecnicos',
    loadComponent: () =>
      import('./pages/relatorio-tecnicos/relatorio-tecnicos.component').then(m => m.RelatorioTecnicosComponent),
    data: { roles: ['Administrador'] }
  }
];
