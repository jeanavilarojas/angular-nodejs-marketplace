import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpRequest, HttpHandler,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from './authentication.service';
import { NotificacionService, TipoMessage } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class HttpErrorInterceptorService implements HttpInterceptor {
  //Recuerde que es necesario llamarlo como Proveedor
  //en AppModule
  constructor(

    private auth: AuthenticationService,
    private noti: NotificacionService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //Obtener token
    let token = null;
    if (this.auth.currentUserValue != null) {
      token = this.auth.currentUserValue.token;
    }
    //Agregar headers a la solicitud
    if (token) {
      //Header con el token
      request = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + token),
      });
    }
    //Opcional indicar el tipo de contenido JSON
    if (!request.headers.has('Content-Type')) {
      request = request.clone({
        headers: request.headers.set('Content-Type', 'application/json'),
      });
    }

    request = request.clone({
      headers: request.headers.set('Accept', 'application/json'),
    });

    //Capturar el error
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let message: string = "";
        //Códigos de estado HTTP con su respectivo mensaje
        switch (error.status) {
          case 400:
            message = 'Solicitud incorrecta';
            break;
          case 401:
            message = 'Acceso denegado: Credenciales inválidas o usuario inactivo';
            break;
          case 403:
            message = 'Acceso denegado';
            break;
          case 422:
            message = 'Se ha presentado un error';
            break;
        }
        //Mostrar un mensaje de error
        this.noti.mensaje('Error' + ' ' + error.status, message, TipoMessage.error);
        throw new Error(error.message);
      })
    );
  }
}
