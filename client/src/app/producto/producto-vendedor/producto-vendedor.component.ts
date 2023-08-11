import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';

@Component({
  selector: 'app-producto-vendedor',
  templateUrl: './producto-vendedor.component.html',
  styleUrls: ['./producto-vendedor.component.css'],
})
export class ProductoVendedorComponent {
  datos: any; // Respuesta del API
  destroy$: Subject<boolean> = new Subject<boolean>();
  userId = 2; // Id del vendedor

  constructor(private gService: GenericService, private router: Router, private route: ActivatedRoute) {
    this.listaProductos();
  }

  // Listar los productos del vendedor llamando al API
  listaProductos() {
    const endpoint = 'producto';
    this.gService
      .listByVendedor(endpoint, this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
        this.datos = data;
      });
  }

  // Crear un producto nuevo
  crearProducto() {
    this.router.navigate(['/producto/crear']);
  }

  // Direccionar a la página de detalle
  detalleProducto(id: number) {
    this.router.navigate(['/producto/detalle', id]);
  }

  // Editar el producto seleccionado
  actualizarProducto(id: number) {
    this.router.navigate(['/producto/actualizar', id]);
  }
}
