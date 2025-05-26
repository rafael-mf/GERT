import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth/guards/auth.guard';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'chamados',
        loadChildren: () => import('./features/chamados/chamados.module').then(m => m.ChamadosModule)
      },
      {
        path: 'clientes',
        loadChildren: () => import('./features/clientes/clientes.module').then(m => m.ClientesModule)
      },
      {
        path: 'estoque',
        loadChildren: () => import('./features/estoque/estoque.module').then(m => m.EstoqueModule)
      },
      {
        path: 'tecnicos',
        loadChildren: () => import('./features/tecnicos/tecnicos.module').then(m => m.TecnicosModule)
      },
      {
        path: 'relatorios',
        loadChildren: () => import('./features/relatorios/relatorios.module').then(m => m.RelatoriosModule)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
