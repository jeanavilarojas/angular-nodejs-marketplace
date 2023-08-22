import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { GenericService } from 'src/app/share/generic.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ProductoPreguntaComponent } from '../producto-pregunta/producto-pregunta.component';
import { ProductoRespuestaComponent } from '../producto-respuesta/producto-respuesta.component';
import { CartService } from 'src/app/share/cart.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';

@Component({
  selector: 'app-producto-detalle',
  templateUrl: './producto-detalle.component.html',
  styleUrls: ['./producto-detalle.component.css'],
  animations: [trigger('slideInOut', [
    state('in', style({ height: '*', opacity: 1, })),
    state('out', style({ height: '0', opacity: 0, })),
    transition('in => out', animate('300ms ease-in-out')),
    transition('out => in', animate('300ms ease-in-out')),
  ]),
  ],
})
export class ProductoDetalleComponent implements OnInit, OnDestroy {
  productoId: number;
  producto: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private gService: GenericService,
    private sanitizer: DomSanitizer,
    private cartService: CartService,
    private notificacion: NotificacionService) { }

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

  // Crear pregunta
  crearPregunta(id: number) {
    this.router.navigate(['/pregunta/crear', id]);
  }

  // Crear respuesta
  crearRespuesta(id: number) {
    this.router.navigate(['/respuesta/crear', id]
    );
  }

  // Agregar al carrito
  agregarCarrito(id: number) {
    this.gService
      .get('producto', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.cartService.addToCart(data);
        this.notificacion.mensaje(
          'Orden',
          'Producto: ' + data.producto + ' agregado al carrito',
          TipoMessage.success
        )
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
