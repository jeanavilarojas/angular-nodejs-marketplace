import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  ServerUrl = environment.apiURL;
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private authenticated = new BehaviorSubject<boolean>(false);
  usuarioId: number;
  isAdmin: boolean = false;
  isVendedor: boolean = false;
  isCliente: boolean = false;

  constructor(private http: HttpClient, private cartService: CartService) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
    this.currentUser.subscribe((data) => {
      this.usuarioId = data.usuario.id;
      this.roles();
    });
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  get isAuthenticated() {
    if (this.currentUserValue != null) {
      this.authenticated.next(true);
    } else {
      this.authenticated.next(false);
    }
    return this.authenticated.asObservable();
  }

  createUser(usuario: any): Observable<any> {
    return this.http.post<any>(this.ServerUrl + 'usuario/register', usuario);
  }

  loginUser(usuario: any): Observable<any> {
    this.isAdmin = false;
    this.isVendedor = false;
    this.isCliente = false;
    return this.http.post<any>(this.ServerUrl + 'usuario/login', usuario).pipe(
      map((usuario) => {
        localStorage.setItem('currentUser', JSON.stringify(usuario.data));
        this.authenticated.next(true);
        this.currentUserSubject.next(usuario.data);
        return usuario;
      })
    );
  }

  roles() {
    const user = this.currentUserValue;
    if (user && user.usuario && user.usuario.roles) {
      for (let i = 0; i < user.usuario.roles.length; i++) {
        switch (user.usuario.roles[i].descripcion) {
          case 'Administrador':
            this.isAdmin = true;
            break;
          case 'Vendedor':
            this.isVendedor = true;
            break;
          case 'Cliente':
            this.isCliente = true;
            break;
          default:
            break;
        }
      }
    }
  }

  logout() {
    let usuario = this.currentUserSubject.value;
    if (usuario) {
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
      this.authenticated.next(false);
      this.cartService.deleteCart();
      return true;
    }
    return false;
  }
}
