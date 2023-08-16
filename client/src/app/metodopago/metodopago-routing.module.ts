import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MetodopagoFormComponent } from './metodopago-form/metodopago-form.component';

const routes: Routes = [
  { path: 'metodopago/crear', component: MetodopagoFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MetodopagoRoutingModule { }
