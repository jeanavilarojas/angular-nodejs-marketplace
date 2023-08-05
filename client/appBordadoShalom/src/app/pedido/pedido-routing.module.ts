import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PedidoIndexComponent } from './pedido-index/pedido-index.component';
import { PedidoDetalleComponent } from './pedido-detalle/pedido-detalle.component';
import { PedidoVendedorComponent } from './pedido-vendedor/pedido-vendedor.component';

const routes: Routes = [
  { path: 'pedido', component: PedidoIndexComponent },
  { path: 'pedido-detalle/:id', component: PedidoDetalleComponent },
  { path: 'pedido-vendedor', component: PedidoVendedorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedidoRoutingModule {}
