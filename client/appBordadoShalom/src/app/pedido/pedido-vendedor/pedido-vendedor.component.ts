import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';

@Component({
  selector: 'app-pedido-vendedor',
  templateUrl: './pedido-vendedor.component.html',
  styleUrls: ['./pedido-vendedor.component.css'],
})
export class PedidoVendedorComponent {
  datos: any; // Respuesta del API
  destroy$: Subject<boolean> = new Subject<boolean>();
  userId = 5; // Id del cliente

  constructor(private gService: GenericService, private router: Router) {
    this.listaPedidos();
  }

  // Listar los pedidos del cliente llamando al API
  listaPedidos() {
    const endpoint = 'pedido';
    this.gService
      .listByCliente(endpoint, this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
        this.datos = data;
      });
  }

  detallePedido(id: number) {
    this.router.navigate(['/pedido-detalle', id]);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
