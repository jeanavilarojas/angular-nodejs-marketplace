import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PedidoIndexComponent } from './pedido-index/pedido-index.component';
import { PedidoDetalleComponent } from './pedido-detalle/pedido-detalle.component';
import { PedidoVendedorComponent } from './pedido-vendedor/pedido-vendedor.component';

const routes: Routes = [
  { path: 'pedidos/cliente', component: PedidoIndexComponent },
  { path: 'pedidos/vendedor', component: PedidoVendedorComponent },
  { path: 'pedido/detalle/:id', component: PedidoDetalleComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedidoRoutingModule { }
