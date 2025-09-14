import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaServicosComponent } from './pages/lista-servicos/lista-servicos.component';

const routes: Routes = [
  {
    path: '',
    component: ListaServicosComponent
  },
  {
    path: 'novo',
    loadComponent: () => import('./pages/form-servico/form-servico.component').then(m => m.FormServicoComponent)
  },
  {
    path: ':id/editar',
    loadComponent: () => import('./pages/form-servico/form-servico.component').then(m => m.FormServicoComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicosRoutingModule { }
