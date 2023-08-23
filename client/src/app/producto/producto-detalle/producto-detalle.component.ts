import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { GenericService } from 'src/app/share/generic.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CartService } from 'src/app/share/cart.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';
import { AuthenticationService } from 'src/app/share/authentication.service';

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
  isAutenticated: boolean;
  currentUser: any;
  usuarioId: number;
  isVendedor: boolean = false;
  isCliente: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gService: GenericService,
    private authService: AuthenticationService,
    private sanitizer: DomSanitizer,
    private cartService: CartService,
    private notificacion: NotificacionService) { }

  ngOnInit() {
    this.authService.currentUser.subscribe((x) => {
      this.currentUser = x;
      this.authService.isAuthenticated.subscribe(
        (valor) => (this.isAutenticated = valor)
      );
    });
    // Verificar si el usuario es vendedor
    this.isVendedor = this.authService.isVendedor;
    // Verificar si el usuario es cliente
    this.isCliente = this.authService.isCliente;
    // Subscripción al booleano que indica si esta autenticado
    this.authService.isAuthenticated.subscribe((valor) => {
      this.isAutenticated = valor;
    });
    this.usuarioId = this.authService.usuarioId;
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
          'Producto agregado al carrito',
          TipoMessage.success
        )
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
