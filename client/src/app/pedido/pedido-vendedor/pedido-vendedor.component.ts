import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';

@Component({
  selector: 'app-pedido-vendedor',
  templateUrl: './pedido-vendedor.component.html',
  styleUrls: ['./pedido-vendedor.component.css'],
})
export class PedidoVendedorComponent {
  id: number;
  pedidos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private gService: GenericService, private route: ActivatedRoute, private router: Router, private notification: NotificacionService) {
    let id = this.route.snapshot.paramMap.get('id');
    this.id = +id;
    if (!isNaN(Number(this.id))) {
      this.listaPedidos(Number(this.id));
    }
  }

  // Listar los pedidos del vendedor llamando al API
  listaPedidos(id: number) {
    this.gService
      .get('pedido/vendedor', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
        this.pedidos = data;
      });
  }

  // Direccionar a la página de editar
  detallePedido(id: number) {
    this.router.navigate(['/pedido/detalle', id]);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
