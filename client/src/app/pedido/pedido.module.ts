import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoDetalleComponent } from './pedido-detalle/pedido-detalle.component';
import { PedidoIndexComponent } from './pedido-index/pedido-index.component';
import { PedidoVendedorComponent } from './pedido-vendedor/pedido-vendedor.component';
import { PedidoCarritoComponent } from './pedido-carrito/pedido-carrito.component';
import { PedidoRoutingModule } from './pedido-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    PedidoDetalleComponent,
    PedidoIndexComponent,
    PedidoVendedorComponent,
    PedidoCarritoComponent
  ],
  imports: [CommonModule,
    PedidoRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule],
})
export class PedidoModule { }
