import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms'; 
import { MatCardModule } from '@angular/material/card'; 

import { GenericService } from 'src/app/share/generic.service';

@Component({
  selector: 'app-pregunta-form',
  templateUrl: './pregunta-form.component.html',
  styleUrls: ['./pregunta-form.component.css']
})
export class PreguntaFormComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();
  // Titulo
  titleForm: string = 'Crear Pregunta';
  // Respuesta del API crear/modificar
  respPregunta: any;
  // Pregunta a actualizar
  preguntaInfo: any;
  // Sí es submit
  submitted = false;
  // Nombre del formulario
  detalleForm: FormGroup;
  // id del Detalle
  idPregunta: number = 0;
  // Sí es crear
  isCreate: boolean = true;
  // ID del producto
  idProducto: number = 0;
  productoForm: FormGroup;
  currentUser: any;
  idUsuario: number;


  constructor(
    private fb: FormBuilder,
    private gService: GenericService,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private authService: AuthenticationService
  ) {
    this.formularioReactive();
    this.idUsuario = this.authService.usuarioId;
    console.log(this.idUsuario);
  }

  ngOnInit(): void {
    this.activeRouter.params.subscribe((params: Params) => {
      this.idProducto = Number(params['idProducto']);
      if (this.idPregunta != undefined) {
        this.isCreate = false;
        this.titleForm = 'Actualizar';

        // Obtener pregunta a actualizar del API
        this.gService
          .get('pregunta', this.idPregunta)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            this.preguntaInfo = data;

            // Establecer los valores en cada una de las entradas del formulario
            this.detalleForm.setValue({
              id: this.preguntaInfo.idProducto, // Asegúrate de que el nombre del campo sea "id"
              descripcion: this.preguntaInfo.descripcion, // Asegúrate de que el nombre del campo sea "descripcion"
              vendedorId: this.preguntaInfo.vendedorId,
            });
          });
          this.authService.currentUser.subscribe((x) => (this.currentUser = x));
          this.idUsuario = this.currentUser.user.id;
      }else {
  // Maneja el caso cuando el objeto es nulo
  console.error("Error: El objeto es nulo.");
}
    });
  }

  

  // Crear Formulario
  formularioReactive() {
    //[null, Validators.required]
    this.detalleForm = this.fb.group({
      id: [null, null],
      descripcion: [
        null,
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],
    });
  }

  public errorHandling = (control: string, error: string) => {
    return this.detalleForm.controls[control].hasError(error);
  };

  // Crear Pregunta
  crearPregunta(): void {
    this.submitted = true;
    this.productoForm.patchValue({ vendedorId: this.idUsuario });
    if (this.detalleForm.invalid) {
      return;
    }
    const formData = new FormData();
    const formValue = this.detalleForm.value;

    const descripcion = this.detalleForm.get('descripcion')?.value;
    const productoId = this.idProducto; 
    const nuevaPregunta = {
      descripcion,
      productoId,
      
    };

    // Hacer la llamada al servicio para crear la pregunta
    this.gService
      .create('pregunta', nuevaPregunta)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: any) => {
          this.respPregunta = data;
          if (this.idProducto !== null && this.idProducto !== undefined) {
            this.router.navigate(['/producto-detalle', this.idProducto], {
              queryParams: { create: 'true' },
            });
          } else {
            console.error('Error: this.idProducto no tiene un valor válido.');
          }
        },
        (error) => {
          console.error('Error al crear la pregunta', error);
        }
      );
  }

 

onReset() {
  this.submitted = false;
  this.detalleForm.reset();
}

onBack() {
  this.router.navigate(['/producto/detalle']);
}

ngOnDestroy() {
  this.destroy$.next(true);
  // Desinscribirse
  this.destroy$.unsubscribe
 }
}
