import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NotificacionService } from 'src/app/share/notification.service';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { GenericService } from 'src/app/share/generic.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css'],
})
export class UserCreateComponent implements OnInit {
  hide = true;
  usuario: any;
  rolesList: any[];
  formCreate: FormGroup;
  makeSubmit: boolean = false;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private gService: GenericService,
    private authService: AuthenticationService
  ) {
    this.reactiveForm();
  }

  reactiveForm() {
    this.formCreate = this.fb.group({
      nombre: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      identificacion: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      contrasenna: ['', [Validators.required]],
      roles: this.fb.array([], Validators.required), // FormArray para roles
    });
    this.listaRoles();
  }

  // Obtener el FormArray de roles
  get rolesFormArray() {
    return this.formCreate.get('roles') as FormArray;
  }

  ngOnInit(): void {}

  submitForm() {
    this.makeSubmit = true;
    if (this.formCreate.invalid) {
      return;
    }
    this.authService.createUser(this.formCreate.value).subscribe((respuesta: any) => {
      this.usuario = respuesta;
      this.router.navigate(['/usuario/login'], {
        queryParams: { register: 'true' },
      });
    });
  }

  onReset() {
    this.formCreate.reset();
  }

  listaRoles() {
    this.rolesList = null;
    this.gService
      .list('rol')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.rolesList = data;
      });
  }

  public errorHandling = (control: string, error: string) => {
    return (
      this.formCreate.controls[control].hasError(error) &&
      this.formCreate.controls[control].invalid &&
      (this.makeSubmit || this.formCreate.controls[control].touched)
    );
  };
}
