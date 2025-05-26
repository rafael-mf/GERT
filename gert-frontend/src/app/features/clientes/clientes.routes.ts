import { Routes } from '@angular/router';

export const CLIENTES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/lista-cliente/lista-cliente.component').then(m => m.ListaClienteComponent)
  },
  {
    path: 'novo',
    loadComponent: () =>
      import('./pages/novo-cliente/novo-cliente.component').then(m => m.NovoClienteComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/detalhe-cliente/detalhe-cliente.component').then(m => m.DetalheClienteComponent)
  },
  {
    path: ':id/editar',
    loadComponent: () =>
      import('./pages/editar-cliente/editar-cliente.component').then(m => m.EditarClienteComponent)
  }
];
