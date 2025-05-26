import { Routes } from '@angular/router';

export const ESTOQUE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/lista-peca/lista-peca.component').then(m => m.ListaPecaComponent)
  },
  {
    path: 'novo',
    loadComponent: () =>
      import('./pages/novo-peca/novo-peca.component').then(m => m.NovoPecaComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/detalhe-peca/detalhe-peca.component').then(m => m.DetalhePecaComponent)
  },
  {
    path: ':id/editar',
    loadComponent: () =>
      import('./pages/editar-peca/editar-peca.component').then(m => m.EditarPecaComponent)
  }
];
