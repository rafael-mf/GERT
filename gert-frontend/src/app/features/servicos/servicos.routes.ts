import { Routes } from '@angular/router';

export const SERVICOS_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./servicos-routing.module').then(m => m.ServicosRoutingModule)
  }
];