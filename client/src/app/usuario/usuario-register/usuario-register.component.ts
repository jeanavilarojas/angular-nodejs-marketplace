import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { NotificacionService } from 'src/app/share/notification.service';
import { GenericService } from 'src/app/share/generic.service';

@Component({
  selector: 'app-usuario-register',
  templateUrl: './usuario-register.component.html',
  styleUrls: ['./usuario-register.component.css']
})
export class UsuarioRegisterComponent implements OnInit {
  hide = true;
  usuario: any;
  rolesList: any;
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

  ngOnInit(): void { }

  reactiveForm() {
    this.formCreate = this.fb.group({
      nombre: [null, [Validators.required]],
      apellidos: [null, [Validators.required]],
      identificacion: [null, [Validators.required]],
      telefono: [null, [Validators.required]],
      correo: [null, [Validators.required, Validators.email]],
      contrasenna: [null, [Validators.required]],
      roles: [null, Validators.required],
    });
    this.listaRoles();
  }

  submitForm() {
    this.makeSubmit = true;
    if (this.formCreate.invalid) {
      return;
    }
    const formData = { ...this.formCreate.value, roles: this.formCreate.value.roles.map((rol) => parseInt(rol)), };
    this.authService.createUser(formData).subscribe((respuesta: any) => {
      this.usuario = respuesta;
      this.router.navigate(['/usuario/login'], {
        queryParams: { register: 'true' },
      });
    });
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

  onReset() {
    this.formCreate.reset();
  }
}
