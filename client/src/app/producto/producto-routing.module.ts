import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductoIndexComponent } from './producto-index/producto-index.component';
import { ProductoDetalleComponent } from './producto-detalle/producto-detalle.component';
import { ProductoVendedorComponent } from './producto-vendedor/producto-vendedor.component';
import { ProductoFormComponent } from './producto-form/producto-form.component';

const routes: Routes = [
  { path: 'producto', component: ProductoIndexComponent },
  { path: 'producto-detalle/:id', component: ProductoDetalleComponent },
  { path: 'producto-vendedor', component: ProductoVendedorComponent },
  { path: 'producto/create', component: ProductoFormComponent },
  { path: 'producto/update/:id', component: ProductoFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductoRoutingModule { }
