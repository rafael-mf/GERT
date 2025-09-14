import { Routes } from '@angular/router';

export const PERFIL_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () => import('./perfil.module').then(m => m.PerfilModule)
  }
];