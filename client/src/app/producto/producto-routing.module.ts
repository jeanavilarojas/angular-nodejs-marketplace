import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductoAllComponent } from './producto-all/producto-all.component';
import { ProductoIndexComponent } from './producto-index/producto-index.component';
import { ProductoDetalleComponent } from './producto-detalle/producto-detalle.component';
import { ProductoVendedorComponent } from './producto-vendedor/producto-vendedor.component';
import { ProductoFormComponent } from './producto-form/producto-form.component';
import { PreguntaFormComponent } from './producto-detalle/pregunta-form/pregunta-form.component';

const routes: Routes = [
  { path: 'productos/administrador', component: ProductoAllComponent },
  { path: 'productos/cliente', component: ProductoIndexComponent },
  { path: 'productos/vendedor', component: ProductoVendedorComponent },
  { path: 'producto/detalle/:id', component: ProductoDetalleComponent },
  { path: 'producto/crear', component: ProductoFormComponent },
  { path: 'producto/actualizar/:id', component: ProductoFormComponent },
  { path: 'pregunta/crear/:idProducto', component: PreguntaFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductoRoutingModule { }
