import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PedidoRoutingModule } from './pedido-routing.module';
import { PedidoIndexComponent } from './pedido-index/pedido-index.component';
import { PedidoDetalleComponent } from './pedido-detalle/pedido-detalle.component';
import { PedidoVendedorComponent } from './pedido-vendedor/pedido-vendedor.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    PedidoIndexComponent,
    PedidoDetalleComponent,
    PedidoVendedorComponent,
  ],
  imports: [CommonModule, PedidoRoutingModule, MatCardModule, MatIconModule],
})
export class PedidoModule {}
