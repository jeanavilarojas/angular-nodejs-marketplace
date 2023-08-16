import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DireccionFormComponent } from './direccion-form/direccion-form.component';

const routes: Routes = [
  { path: 'direccion/crear', component: DireccionFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DireccionRoutingModule { }
