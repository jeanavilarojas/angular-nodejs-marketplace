import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { GenericService } from 'src/app/share/generic.service';

@Component({
  selector: 'app-producto-detalle',
  templateUrl: './producto-detalle.component.html',
  styleUrls: ['./producto-detalle.component.css'],
})
export class ProductoDetalleComponent implements OnInit, OnDestroy {
  productoId: number;
  producto: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  
  constructor(private route: ActivatedRoute, private gService: GenericService, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.productoId = Number(params['id']);
      if (!isNaN(this.productoId)) {
        this.obtenerProducto();
      }
    });
  }

  // Obtener detalles del producto
  obtenerProducto() {
    this.gService
      .get('producto', this.productoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.producto = data;
      });
  }

  // Obtener categorías del producto
  obtenerCategorias(): string {
    if (this.producto && this.producto.categorias) {
      return this.producto.categorias.map((categoria) => categoria.descripcion).join(', ');
    }
    return '';
  }

  // Obtener las fotos del producto
  obtenerImagen(url) {
    const base64Image = 'data:image/jpeg;base64,' + url;
    return this.sanitizer.bypassSecurityTrustUrl(base64Image);
  }

  // Obtener respuesta asociada a una pregunta
  obtenerRespuesta(pregunta: any): string {
    if (pregunta && pregunta.respuestas && pregunta.respuestas.length > 0) {
      return pregunta.respuestas[0].descripcion;
    }
    return 'Aún no hay respuesta';
  }

  // Obtener nombre del cliente asociado a una pregunta
  obtenerNombreCliente(pregunta: any): string {
    if (pregunta && pregunta.cliente) {
      return pregunta.cliente.nombre; // Ajusta esto según la estructura del modelo "Usuario" en el backend
    }
    return '';
  }

  // Obtener nombre del vendedor asociado a una respuesta
  obtenerNombreVendedor(pregunta: any): string {
    if (pregunta && pregunta.respuestas && pregunta.respuestas.length > 0 && pregunta.respuestas[0].vendedor) {
      return pregunta.respuestas[0].vendedor.nombre; // Ajusta esto según la estructura del modelo "Usuario" en el backend
    }
    return '';
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
