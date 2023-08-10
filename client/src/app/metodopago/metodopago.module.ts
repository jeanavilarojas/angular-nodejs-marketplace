import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MetodopagoRoutingModule } from './metodopago-routing.module';
import { MetodopagoFormComponent } from './metodopago-form/metodopago-form.component';


@NgModule({
  declarations: [
    MetodopagoFormComponent
  ],
  imports: [
    CommonModule,
    MetodopagoRoutingModule
  ]
})
export class MetodopagoModule { }
