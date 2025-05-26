import { Routes } from '@angular/router';

export const TECNICOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/lista-tecnico/lista-tecnico.component').then(m => m.ListaTecnicoComponent)
  },
  {
    path: 'novo',
    loadComponent: () =>
      import('./pages/novo-tecnico/novo-tecnico.component').then(m => m.NovoTecnicoComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/detalhe-tecnico/detalhe-tecnico.component').then(m => m.DetalheTecnicoComponent)
  },
  {
    path: ':id/editar',
    loadComponent: () =>
      import('./pages/editar-tecnico/editar-tecnico.component').then(m => m.EditarTecnicoComponent)
  }
];
