import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductoRoutingModule } from './producto-routing.module';
import { ProductoIndexComponent } from './producto-index/producto-index.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';  
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';

import { ProductoDetalleComponent } from './producto-detalle/producto-detalle.component';
import { ProductoFormComponent } from './producto-form/producto-form.component';

import { ProductoVendedorComponent } from './producto-vendedor/producto-vendedor.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    ProductoIndexComponent,
    ProductoDetalleComponent,
    ProductoVendedorComponent,
    ProductoFormComponent,
  ],
  imports: [
    CommonModule,
    ProductoRoutingModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatDividerModule,
    MatGridListModule,
    MatDialogModule,
    MatMenuModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDividerModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    ReactiveFormsModule
    
  ],
})
export class ProductoModule {}
