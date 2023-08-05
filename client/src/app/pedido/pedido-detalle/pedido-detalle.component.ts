import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';

@Component({
  selector: 'app-pedido-detalle',
  templateUrl: './pedido-detalle.component.html',
  styleUrls: ['./pedido-detalle.component.css'],
})
export class PedidoDetalleComponent {
  pedido: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private gService: GenericService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');
    if (!isNaN(Number(id))) {
      this.obtenerPedido(Number(id));
    }
  }

  obtenerPedido(id: any) {
    this.gService
      .get('pedido', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data && !Array.isArray(data)) {
          this.pedido = [data];
        } else {
          this.pedido = data;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
