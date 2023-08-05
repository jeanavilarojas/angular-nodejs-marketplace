import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';

@Component({
  selector: 'app-pedido-vendedor',
  templateUrl: './pedido-vendedor.component.html',
  styleUrls: ['./pedido-vendedor.component.css'],
})
export class PedidoVendedorComponent implements OnInit {
  pedidos: any[] = [];
  userId = 2; // Id del vendedor

  constructor(private gService: GenericService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getPedidosPorVendedor();
  }

  getPedidosPorVendedor() {
    this.gService.listByVendedor('pedido', this.userId)
      .subscribe((data: any[]) => {
        this.pedidos = data;
      });
  }

    // Direccionar a la página de editar
    // *** FALTA ARREGLAR ***
    // *** FALTA ARREGLAR ***
    // *** FALTA ARREGLAR ***
    editarPedido(id: number) {
      this.router.navigate(['/producto-detalle', id]);
    }
}
