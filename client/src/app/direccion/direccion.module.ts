import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DireccionRoutingModule } from './direccion-routing.module';
import { DireccionFormComponent } from './direccion-form/direccion-form.component';


@NgModule({
  declarations: [
    DireccionFormComponent
  ],
  imports: [
    CommonModule,
    DireccionRoutingModule
  ]
})
export class DireccionModule { }
