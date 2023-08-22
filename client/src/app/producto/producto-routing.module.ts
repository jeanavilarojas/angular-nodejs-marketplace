import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductoAllComponent } from './producto-all/producto-all.component';
import { ProductoIndexComponent } from './producto-index/producto-index.component';
import { ProductoDetalleComponent } from './producto-detalle/producto-detalle.component';
import { ProductoFormComponent } from './producto-form/producto-form.component';
import { ProductoPreguntaComponent } from './producto-pregunta/producto-pregunta.component';
import { ProductoRespuestaComponent } from './producto-respuesta/producto-respuesta.component';
import { ProductoVendedorComponent } from './producto-vendedor/producto-vendedor.component';

const routes: Routes = [
  { path: 'productos/administrador', component: ProductoAllComponent },
  { path: 'productos/cliente', component: ProductoIndexComponent },
  { path: 'producto/vendedor/:id', component: ProductoVendedorComponent },
  { path: 'producto/detalle/:id', component: ProductoDetalleComponent },
  { path: 'producto/crear', component: ProductoFormComponent },
  { path: 'producto/actualizar/:id', component: ProductoFormComponent },
  { path: 'pregunta/crear/:id', component: ProductoPreguntaComponent },
  { path: 'respuesta/crear/:id', component: ProductoRespuestaComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductoRoutingModule { }
