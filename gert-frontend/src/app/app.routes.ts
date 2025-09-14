import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';
import { inject } from '@angular/core';
import { AuthService } from './core/auth/services/auth.service';
import { Router } from '@angular/router';

// Guard de autenticação como função
export const authGuard = (route: any, state: any) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    // Verificar se há restrições de papel/cargo
    if (route.data && route.data['roles']) {
      const userCargo = authService.currentUserValue?.cargo;
      const requiredRoles = route.data['roles'];
      
      // Mapear cargos do banco para os esperados pelo frontend
      const cargoMapping: { [key: string]: string[] } = {
        'admin': ['Administrador', 'admin'],
        'Administrador': ['Administrador', 'admin'],
        'tecnico': ['Técnico', 'tecnico'],
        'Técnico': ['Técnico', 'tecnico']
      };
      
      const allowedCargos = cargoMapping[userCargo || ''] || [userCargo];
      const hasAccess = requiredRoles.some((role: string) => allowedCargos.includes(role));
      
      if (!hasAccess) {
        router.navigate(['/acesso-negado']);
        return false;
      }
    }
    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'acesso-negado',
    loadComponent: () =>
      import('./shared/pages/acesso-negado/acesso-negado.component').then(m => m.AcessoNegadoComponent)
  },
  // Rotas independentes com MainLayoutComponent
  {
    path: 'perfil',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/perfil/pages/perfil-edit/perfil-edit.component').then(m => m.PerfilEditComponent)
      }
    ]
  },
  {
    path: 'configuracoes',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/configuracoes/pages/configuracoes-home/configuracoes-home.component').then(m => m.ConfiguracoesHomeComponent)
      }
    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard-home/dashboard-home.component').then(m => m.DashboardHomeComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      // Rotas para Chamados
      {
        path: 'chamados',
        loadChildren: () =>
          import('./features/chamados/chamados.routes').then(m => m.CHAMADOS_ROUTES)
      },
      // Rotas para Clientes
      {
        path: 'clientes',
        loadChildren: () =>
          import('./features/clientes/clientes.routes').then(m => m.CLIENTES_ROUTES)
      },
      // Rotas para Estoque
      {
        path: 'estoque',
        loadChildren: () =>
          import('./features/estoque/estoque.routes').then(m => m.ESTOQUE_ROUTES)
      },
      // Rotas para Técnicos
      {
        path: 'tecnicos',
        loadChildren: () =>
          import('./features/tecnicos/tecnicos.routes').then(m => m.TECNICOS_ROUTES)
      },
      // Rotas para Serviços
      {
        path: 'servicos',
        loadChildren: () =>
          import('./features/servicos/servicos.routes').then(m => m.SERVICOS_ROUTES)
      },
      // Rotas para Relatórios
      {
        path: 'relatorios',
        loadChildren: () =>
          import('./features/relatorios/relatorios.routes').then(m => m.RELATORIOS_ROUTES)
      },

    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
