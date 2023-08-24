import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';
import { AuthenticationService } from 'src/app/share/authentication.service';

@Component({
  selector: 'app-pedido-detalle',
  templateUrl: './pedido-detalle.component.html',
  styleUrls: ['./pedido-detalle.component.css'],
})
export class PedidoDetalleComponent {
  pedido: any;
  currentUser: any;
  usuarioId: number;
  isAdmin: boolean = false;
  isVendedor: boolean = false;
  isAutenticated: boolean;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private gService: GenericService, private route: ActivatedRoute, private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe((x) => {
      this.currentUser = x;
      this.authService.isAuthenticated.subscribe(
        (valor) => (this.isAutenticated = valor)
      );
    });
    // Verificar si el usuario es administrador
    this.isAdmin = this.authService.isAdmin;
    // Verificar si el usuario es vendedor
    this.isVendedor = this.authService.isVendedor;
    // Subscripción al booleano que indica si esta autenticado
    this.authService.isAuthenticated.subscribe((valor) => {
      this.isAutenticated = valor;
    });
    this.usuarioId = this.authService.usuarioId;
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
        console.log('Información del pedido:', this.pedido);
      });
  }

  ocultarNumerosTarjeta(numeroCuenta: string): string {
    const partes = numeroCuenta.split('-'); // Divide el número en partes por guiones
    const ultimaParte = partes[partes.length - 1]; // Obtiene la última parte (últimos 4 dígitos)
    // Genera asteriscos para las partes anteriores
    const partesOcultas = partes.slice(0, -1).map(parte => '*'.repeat(parte.length));
    // Combina las partes ocultas y la última parte con guiones
    const numeroOculto = [...partesOcultas, ultimaParte].join('-');
    return numeroOculto;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
