import { Routes } from '@angular/router';

export const RELATORIOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/dashboard-relatorios/dashboard-relatorios.component').then(m => m.DashboardRelatoriosComponent)
  },
  {
    path: 'chamados',
    loadComponent: () =>
      import('./pages/relatorio-chamados/relatorio-chamados.component').then(m => m.RelatorioChamadosComponent)
  },
  {
    path: 'financeiro',
    loadComponent: () =>
      import('./pages/relatorio-financeiro/relatorio-financeiro.component').then(m => m.RelatorioFinanceiroComponent)
  },
  {
    path: 'estoque',
    loadComponent: () =>
      import('./pages/relatorio-estoque/relatorio-estoque.component').then(m => m.RelatorioEstoqueComponent)
  },
  {
    path: 'tecnicos',
    loadComponent: () =>
      import('./pages/relatorio-tecnicos/relatorio-tecnicos.component').then(m => m.RelatorioTecnicosComponent)
  }
];
