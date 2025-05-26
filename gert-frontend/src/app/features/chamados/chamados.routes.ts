import { Routes } from '@angular/router';

export const CHAMADOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/lista-chamados/lista-chamados.component').then(m => m.ListaChamadosComponent)
  },
  {
    path: 'novo',
    loadComponent: () =>
      import('./pages/novo-chamado/novo-chamado.component').then(m => m.NovoChamadoComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/detalhe-chamado/detalhe-chamado.component').then(m => m.DetalheChamadoComponent)
  },
  {
    path: ':id/editar',
    loadComponent: () =>
      import('./pages/editar-chamado/editar-chamado.component').then(m => m.EditarChamadoComponent)
  }
];
