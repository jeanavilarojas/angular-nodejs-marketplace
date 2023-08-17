import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { GenericService } from 'src/app/share/generic.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { LocationService } from 'src/app/share/location.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-direccion-form',
  templateUrl: './direccion-form.component.html',
  styleUrls: ['./direccion-form.component.css']
})
export class DireccionFormComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  titleForm: string = 'Agregar';
  direccionInfo: any;
  currentUser: any;
  respDireccion: any;
  idUsuario: number;
  submitted = false;
  direccionForm: FormGroup;
  idDireccion: number = 0;
  isCreate: boolean = true;
  provincias: any;
  cantones: any;
  distritos: any;

  constructor(
    private fb: FormBuilder,
    private gService: GenericService,
    private activeRouter: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,
    private locationService: LocationService
  ) {
    this.formularioReactive();
    this.obtenerProvincias();
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe((x) => {
      this.currentUser = x;
      if (x && x.usuario) {
        this.idUsuario = x.usuario.id;
      }
    });
    this.activeRouter.params.subscribe((params: Params) => {
      this.idDireccion = params['id'];
      if (this.idDireccion != undefined) {
        this.isCreate = false;
        this.titleForm = 'Actualizar';
        this.gService.get('direccion', this.idDireccion)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            this.direccionInfo = data;
            this.direccionForm.patchValue({
              id: this.direccionInfo.id,
              provincia: this.direccionInfo.provincia,
              canton: this.direccionInfo.canton,
              distrito: this.direccionInfo.distrito,
              direccionExacta: this.direccionInfo.direccionExacta,
              codigoPostal: this.direccionInfo.codigoPostal,
              telefono: this.direccionInfo.telefono,
              usuarioId: this.direccionInfo.usuarioId,
            });
          });
      }
    });
  }

  formularioReactive() {
    this.direccionForm = this.fb.group({
      id: [null],
      provincia: [null, Validators.required],
      canton: [null, Validators.required],
      distrito: [null, [Validators.required]],
      direccionExacta: [null, [Validators.required]],
      codigoPostal: [null, [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(5)]],
      telefono: [null, [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(8)]],
      usuarioId: [null, Validators.required],
    });
  }

  obtenerProvincias() {
    this.locationService.obtenerProvincias().subscribe((data: any) => {
      this.provincias = Object.entries(data).map(([id, nombre]) => ({ id, nombre }));
    });
  }

  obtenerCantones(idProvincia: string) {
    this.locationService.obtenerCantones(idProvincia).subscribe((data) => {
      this.cantones = Object.entries(data).map(([id, nombre]) => ({ id, nombre, provinciaId: idProvincia }));
    });
    this.distritos = [];
  }

  obtenerDistritos(idProvincia: string, idCanton: string) {
    this.locationService.obtenerDistritos(idProvincia, idCanton).subscribe((data) => {
      this.distritos = Object.entries(data).map(([id, nombre]) => ({ id, nombre }));
    });
  }

  public errorHandling = (control: string, error: string) => {
    return this.direccionForm.controls[control].hasError(error);
  }

  crearDireccion() {
    this.submitted = true;
    this.direccionForm.patchValue({ usuarioId: this.idUsuario });
    console.log(this.direccionForm.value);
    if (this.direccionForm.invalid) {
      return;
    }
    this.direccionForm.value.usuarioId = this.idUsuario;
    this.gService.create('direccion', this.direccionForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.respDireccion = data;
        console.log(data);
        this.router.navigate(['/usuario/perfil', this.idUsuario]);
      });
  }

  actualizarDireccion() { }

  onReset() {
    this.submitted = false;
    this.direccionForm.reset();
  }

  onBack() {
    this.router.navigate(['/usuario/perfil', this.idUsuario]);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
