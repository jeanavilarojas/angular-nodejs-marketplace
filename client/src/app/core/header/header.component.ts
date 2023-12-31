import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';
import { CartService } from 'src/app/share/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  tooltipText: string = 'Cuenta';
  isAutenticated: boolean;
  currentUser: any;
  usuarioId: number;
  qtyItems: number = 0;
  sesion: boolean = false;
  isTrue: number = 0;
  isAdmin: boolean = false;
  isVendedor: boolean = false;
  isCliente: boolean = false;

  constructor(
    private authService: AuthenticationService,
    private notificacionService: NotificacionService,
    private cartService: CartService,
    private router: Router
  ) {
    this.qtyItems = this.cartService.quantityItems();
  }

  ngOnInit(): void {
    // Subscripción a la información del usuario actual
    this.authService.currentUser.subscribe((x) => {
      this.currentUser = x;
      this.authService.isAuthenticated.subscribe(
        (valor) => (this.isAutenticated = valor)
      );
      this.cartService.countItems.subscribe((value) => {
        this.qtyItems = value;
      });
      // Actualizar el texto del tooltip si el usuario está logueado
      if (this.currentUser && this.currentUser.usuario) {
        this.tooltipText =
          this.currentUser.usuario.nombre + ' ' + this.currentUser.usuario.apellidos;
      } else {
        this.tooltipText = 'Cuenta';
      }
      // Verificar si el usuario es administrador
      this.isAdmin = this.authService.isAdmin;
      // Verificar si el usuario es vendedor
      this.isVendedor = this.authService.isVendedor;
      // Verificar si el usuario es cliente
      this.isCliente = this.authService.isCliente;
    });

    // Subscripción al booleano que indica si esta autenticado
    this.authService.isAuthenticated.subscribe((valor) => {
      this.isAutenticated = valor;
    });

    this.usuarioId = this.authService.usuarioId;

    // Suscribirse al observable que gestiona la cantidad de items del carrito
    this.cartService.countItems.subscribe((value) => {
      console.log(value);
      this.qtyItems = value;
    });
  }

  // Redireccionar a iniciar sesión
  login() {
    this.router.navigate(['usuario/login']);
  }

  // Redireccionar al perfil del usuario
  perfil(id: number) {
    this.router.navigate(['/usuario/perfil', id]);
  }

  pedidosCliente(id: number) {
    this.router.navigate(['/pedido/cliente', id]);
  }

  pedidosVendedor(id: number) {
    this.router.navigate(['/pedido/vendedor', id]);
  }

  productosVendedor(id: number) {
    this.router.navigate(['/producto/vendedor', id]);
  }

  pedidoCarrito(id: number) {
    this.router.navigate(['/pedido/carrito', id]);
  }

  // Cerrar la sesión del usuario
  logout() {
    this.sesion = false;
    localStorage.clear();
    this.authService.logout();
    this.notificacionService.mensaje('Éxito', 'La sesión ha sido cerrada correctamente', TipoMessage.success);
    this.router.navigate(['usuario/login']);
  }
}
