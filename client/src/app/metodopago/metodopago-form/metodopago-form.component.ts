import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { GenericService } from 'src/app/share/generic.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-metodopago-form',
  templateUrl: './metodopago-form.component.html',
  styleUrls: ['./metodopago-form.component.css']
})
export class MetodopagoFormComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  titleForm: string = 'Agregar';
  metodoPagoInfo: any;
  currentUser: any;
  respMetodoPago: any;
  idUsuario: number;
  submitted = false;
  metodoForm: FormGroup;
  idMetodoPago: number = 0;
  isCreate: boolean = true;

  constructor(
    private fb: FormBuilder,
    private gService: GenericService,
    private activeRouter: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService
  ) {
    this.formularioReactive();
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe((x) => {
      this.currentUser = x;
      if (x && x.usuario) {
        this.idUsuario = x.usuario.id;
      }
    });
    this.activeRouter.params.subscribe((params: Params) => {
      this.idMetodoPago = params['id'];
      if (this.idMetodoPago != undefined) {
        this.isCreate = false;
        this.titleForm = 'Actualizar';
        this.gService.get('metodoPago', this.idMetodoPago)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            this.metodoPagoInfo = data;
            this.metodoForm.patchValue({
              id: this.metodoPagoInfo.id,
              tipoPago: this.metodoPagoInfo.tipoPago,
              proveedor: this.metodoPagoInfo.proveedor,
              numeroCuenta: this.metodoPagoInfo.numeroCuenta,
              fechaExpiracion: this.metodoPagoInfo.fechaExpiracion,
              usuarioId: this.metodoPagoInfo.usuarioId,
            });
          });
      }
    });
  }

  formularioReactive() {
    this.metodoForm = this.fb.group({
      id: [null],
      tipoPago: [null, Validators.required],
      proveedor: [null, Validators.required],
      numeroCuenta: [null, [Validators.required, Validators.pattern('^[0-9]*$'), this.validarNumeroCuenta,]],
      fechaExpiracion: [null, [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/20[2-9][0-9]$'), this.validarFechaExpiracion,]],
      usuarioId: [null, Validators.required],
    });
  }

  validarNumeroCuenta(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value) {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length > 0 && numericValue.length < 16) {
        return { incompleteLength: true };
      }
      const formattedValue = numericValue.match(/.{1,4}/g)?.join('-') || '';
      control.setValue(formattedValue, { emitEvent: false });
    }
    return null;
  }

  validarFechaExpiracion(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value) {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length > 0 && numericValue.length < 6) {
        return { incompleteLength: true };
      }
      const formattedValue = numericValue.replace(/(\d{2})(\d{0,4})/, '$1/$2');
      control.setValue(formattedValue, { emitEvent: false });
    }
    return null;
  }

  public errorHandling = (control: string, error: string) => {
    return this.metodoForm.controls[control].hasError(error);
  }

  crearMetodoPago() {
    this.submitted = true;
    this.metodoForm.patchValue({ usuarioId: this.idUsuario });
    console.log(this.metodoForm.value);
    if (this.metodoForm.invalid) {
      return;
    }
    this.metodoForm.value.usuarioId = this.idUsuario;
    this.gService.create('metodoPago', this.metodoForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.respMetodoPago = data;
        console.log(data);
        this.router.navigate(['/usuario/perfil', this.idUsuario]);
      });
  }

  actualizarMetodoPago() { }

  onReset() {
    this.submitted = false;
    this.metodoForm.reset();
  }

  onBack() {
    this.router.navigate(['/usuario/perfil', this.idUsuario]);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
