import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';

@Component({
  selector: 'app-pedido-index',
  templateUrl: './pedido-index.component.html',
  styleUrls: ['./pedido-index.component.css'],
})
export class PedidoIndexComponent {
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

  // Direccionar a la página de detalle
  detallePedido(id: number) {
    this.router.navigate(['/pedido/detalle', id]);
  }

  obtenerNombresProductos(productos: any[]): string {
    return productos.map((producto) => producto.producto.nombre).join(', ');
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
