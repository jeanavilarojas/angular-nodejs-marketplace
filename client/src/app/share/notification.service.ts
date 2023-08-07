import { Injectable } from '@angular/core';
import { ToastrService, IndividualConfig } from 'ngx-toastr';

export enum TipoMessage {
  success,
  info,
  warning,
  error,
}

@Injectable({
  providedIn: 'root',
})
export class NotificacionService {
  options: Partial<IndividualConfig>;

  constructor(private toastr: ToastrService) {
    this.options = this.toastr.toastrConfig;
    // Habilitar formato HTML dentro de la notificación
    this.options.enableHtml = true;
    this.options.tapToDismiss = false;
    this.options.closeButton = true;
    this.options.newestOnTop = true;
    this.options.timeOut = 5000;
    // disableTimeOut = true;
    this.options.positionClass = 'toast-top-right';
  }

  /* Presentar mensaje de notificación Toast Type: success, info, warning, error */
  public mensaje(titulo: string, mensaje: string, tipo: TipoMessage) {
    this.toastr.show(
      mensaje,
      titulo,
      this.options,
      'toast-' + TipoMessage[tipo]
    );
  }
}
