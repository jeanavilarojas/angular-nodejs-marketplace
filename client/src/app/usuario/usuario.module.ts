import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuarioRoutingModule } from './usuario-routing.module';
import { UsuarioIndexComponent } from './usuario-index/usuario-index.component';
import { UsuarioDetalleComponent } from './usuario-detalle/usuario-detalle.component';
import { UsuarioLoginComponent } from './usuario-login/usuario-login.component';
import { UsuarioRegisterComponent } from './usuario-register/usuario-register.component';

import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    UsuarioIndexComponent,
    UsuarioDetalleComponent,
    UsuarioLoginComponent,
    UsuarioRegisterComponent
  ],
  imports: [CommonModule, UsuarioRoutingModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule
  ],
})
export class UsuarioModule { }
