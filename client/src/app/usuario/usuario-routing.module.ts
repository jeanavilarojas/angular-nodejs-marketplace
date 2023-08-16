import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioAllComponent } from './usuario-all/usuario-all.component';
import { UsuarioIndexComponent } from './usuario-index/usuario-index.component';
import { UsuarioLoginComponent } from './usuario-login/usuario-login.component';
import { UsuarioRegisterComponent } from './usuario-register/usuario-register.component';

const routes: Routes = [
  { path: 'usuarios/administrador', component: UsuarioAllComponent },
  { path: 'usuario/perfil/:id', component: UsuarioIndexComponent },
  { path: 'usuario/login', component: UsuarioLoginComponent },
  { path: 'usuario/registro', component: UsuarioRegisterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }
