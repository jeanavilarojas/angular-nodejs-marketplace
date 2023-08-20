import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { CartService, ItemCart } from 'src/app/share/cart.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';

@Component({
  selector: 'app-pedido-carrito',
  templateUrl: './pedido-carrito.component.html',
  styleUrls: ['./pedido-carrito.component.css'],
})
export class PedidoCarritoComponent {
  id: number;
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  drireccion: any;
  metodoPago: any;
  currentUser: any;
  idUsuario: number;
  isAuth: boolean;
  usuarioInfo: any;
  total = 0;
  impuesto = 0.13;
  fecha = Date.now();
  displayedColumns: string[] = ['producto', 'cantidad', 'subtotal', 'impuestos', 'acciones'];

  dataSource = new MatTableDataSource<ItemCart>();
  pedidosForm: FormGroup;

  constructor(private gService: GenericService,
    private route: ActivatedRoute,
    private router: Router,
    private noti: NotificacionService,
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private cartService: CartService,
  ) {
    this.authService.isAuthenticated.subscribe((x) => {
      this.currentUser = x;
    });

    this.idUsuario = this.authService.usuarioId;
    if (this.idUsuario != undefined) {
      this.gService
        .get('usuario', this.idUsuario)
        .pipe(takeUntil(this.destroy$))
        .subscribe((respuesta: any) => {
          this.usuarioInfo = respuesta;
          console.log(respuesta);
        });
    }
    this.formularioReactive();
  }

  formularioReactive() {
    this.pedidosForm = this.fb.group({
      direccion: [null, Validators.required],
      metodoPago: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.cartService.currentDataCart$.subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      console.log(data);
    });
    this.total = this.cartService.getTotal();
  }

  actualizarCantidad(item: any) {
    const stockDisponible = item.product.cantidad; // Obtener el stock disponible del producto
    if (item.cantidad > 0 && item.cantidad <= stockDisponible) {
      // Verificar si la cantidad es válida y no excede el stock disponible
      this.cartService.updateCartItemQuantity(item.product, item.cantidad);
      this.total = this.cartService.getTotal();
    } else if (item.cantidad > stockDisponible) {
      this.noti.mensaje('Error', 'Producto insuficiente en stock', TipoMessage.error);
    } else {
      this.noti.mensaje('Error', 'La cantidad seleccionada no es válida', TipoMessage.error);
    }
  }
  eliminarItem(item: any) {
    this.cartService.removeFromCart(item);
    this.total = this.cartService.getTotal();
    this.noti.mensaje('Pedido', 'Producto eliminado', TipoMessage.warning);
  }

  registrarOrden() {
    if (
      this.cartService.getItems != null &&
      this.pedidosForm.value.metodoPago != null &&
      this.pedidosForm.value.direccion != null
    ) {
      // Obtener los items del carrito de compras
      let itemsCarrito = this.cartService.getItems;

      // Verificar si la cantidad de cada producto no supera el stock disponible
      if (itemsCarrito.every(item => item.cantidad <= item.product.cantidad)) {
        let productos = itemsCarrito.map((x) => ({
          productoId: x.idItem,
          cantidad: x.cantidad,
          subtotal: x.subtotal,
          impuestos: (x.cantidad * x.subtotal) * this.impuesto,
          total: (x.subtotal + (x.cantidad * x.subtotal) * this.impuesto)
        }));

        // Datos para el API
        let infoOrden = {
          usuarioId: this.idUsuario, // Asegúrate de que idUsuario tenga un valor correcto
          direccionId: this.pedidosForm.value.direccion,
          metodoPagoId: this.pedidosForm.value.metodoPago,
          total: this.total,
          estado: 'pendiente',
          compras: productos,
        };
        console.log(infoOrden);
        this.gService.create('pedido', infoOrden).subscribe(
          (respuesta: any) => {
            this.noti.mensaje(
              'Pedido',
              'Pedido registrado #' + respuesta.id,
              TipoMessage.success
            );
            this.cartService.deleteCart();
            this.total = this.cartService.getTotal();
            this.onBack();
          },
          (error) => {
            console.error(error); // Manejo de errores
            this.noti.mensaje(
              'Error',
              'No se pudo registrar el pedido',
              TipoMessage.error
            );
          }
        );
      } else {
        this.noti.mensaje(
          'Error',
          'Uno o más productos exceden la cantidad disponible en stock',
          TipoMessage.error
        );
      }
    } else {
      this.noti.mensaje(
        'Pedido',
        'Agregue productos a la orden',
        TipoMessage.warning
      );
    }
  }

  onBack() {
    this.router.navigate(['/productos/cliente']);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}