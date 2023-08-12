import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/share/authentication.service';
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
  qtyItems: number = 0;
  sesion: boolean = false;
  isTrue: number = 0;

  constructor(
    private authService: AuthenticationService,
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Subscripción a la información del usuario actual
    this.authService.currentUser.subscribe((x) => {
      this.currentUser = x;
      // Actualizar el texto del tooltip si el usuario está logueado
      if (this.currentUser && this.currentUser.usuario) {
        this.tooltipText = this.currentUser.usuario.nombre + ' ' + this.currentUser.usuario.apellidos;
      } else {
        this.tooltipText = 'Cuenta';
      }
    });

    // Subscripción al booleano que indica si esta autenticado
    this.authService.isAuthenticated.subscribe((valor) => {
      this.isAutenticated = valor;
    });

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
  perfil() {
    this.router.navigate(['usuario/perfil']);
  }

  // Cerrar la sesión del usuario
  logout() {
    this.sesion = false;
    localStorage.clear();
    this.authService.logout();
    this.router.navigate(['usuario/login']);
  }
}
