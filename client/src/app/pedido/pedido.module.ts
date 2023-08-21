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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    MatIconModule,
    MatTooltipModule,
    MatGridListModule,
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule],
})
export class PedidoModule { }
