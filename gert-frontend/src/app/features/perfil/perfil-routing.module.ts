import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilEditComponent } from './pages/perfil-edit/perfil-edit.component';

const routes: Routes = [
  {
    path: '',
    component: PerfilEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerfilRoutingModule { }