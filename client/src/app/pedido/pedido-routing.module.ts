import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PedidoIndexComponent } from './pedido-index/pedido-index.component';
import { PedidoDetalleComponent } from './pedido-detalle/pedido-detalle.component';
import { PedidoVendedorComponent } from './pedido-vendedor/pedido-vendedor.component';
import { PedidoCarritoComponent } from './pedido-carrito/pedido-carrito.component';

const routes: Routes = [
  { path: 'pedido/cliente/:id', component: PedidoIndexComponent },
  { path: 'pedido/vendedor/:id', component: PedidoVendedorComponent },
  { path: 'pedido/detalle/:id', component: PedidoDetalleComponent },
  { path: 'pedido/carrito/:id', component: PedidoCarritoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedidoRoutingModule { }
