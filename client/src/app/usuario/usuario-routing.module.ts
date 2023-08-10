import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioIndexComponent } from './usuario-index/usuario-index.component';
import { UsuarioDetalleComponent } from './usuario-detalle/usuario-detalle.component';
import { UsuarioLoginComponent } from './usuario-login/usuario-login.component';
import { UsuarioRegisterComponent } from './usuario-register/usuario-register.component';

const routes: Routes = [
  { path: 'usuario', component: UsuarioIndexComponent, children: [{ path: 'login', component: UsuarioLoginComponent }, { path: 'registro', component: UsuarioRegisterComponent }], },
  { path: 'usuario/detalle', component: UsuarioDetalleComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }
