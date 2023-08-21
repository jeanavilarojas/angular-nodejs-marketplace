import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { GenericService } from 'src/app/share/generic.service';

@Component({
  selector: 'app-producto-respuesta',
  templateUrl: './producto-respuesta.component.html',
  styleUrls: ['./producto-respuesta.component.css']
})
export class ProductoRespuestaComponent {
  destroy$: Subject<boolean> = new Subject<boolean>();
  // Titulo
  titleForm: string = 'Crear';
  // Respuesta del API crear/modificar
  respRespuesta: any;
  // Respuesta a actualizar
  respuestaInfo: any;
  // Sí es submit
  submitted = false;
  // Nombre del formulario
  respuestaForm: FormGroup;
  // id del Detalle
  idRespuesta: number;
  // Sí es crear
  isCreate: boolean = true;
  // ID del producto
  idProducto: number = 0;
  // ID de la pregunta
  idPregunta: number;
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
    this.idPregunta = +this.activeRouter.snapshot.paramMap.get('id');
    // this.listaProductos();
    this.idUsuario = this.authService.usuarioId;
    console.log(this.idUsuario);
    console.log(this.idPregunta);
  }
  ngOnInit(): void {
    this.idPregunta = +this.activeRouter.snapshot.paramMap.get('id');
    // Obtenemos el ID del usuario autenticado (ajusta según tu servicio)
    this.idUsuario = this.authService.usuarioId;

    this.activeRouter.params.subscribe((params: Params) => {
      const idRespuesta = params['id'];
      if (idRespuesta !== undefined) {
        this.gService
          .get('respuesta', idRespuesta)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            this.respRespuesta = data;
            this.respuestaForm.patchValue({
              descripcion: this.respRespuesta.descripcion
            });
          });
      }
    });
  }

  formularioReactive() {
    //[null, Validators.required]
    this.respuestaForm = this.fb.group({
      id: [null, null],
      descripcion: [
        null,
        Validators.compose([Validators.required, Validators.minLength(3)]),

      ],
      productoId: [null, Validators.required],
      vendedorId: [null, Validators.required],

    });
  }
  public errorHandling = (control: string, error: string) => {
    return this.respuestaForm.controls[control].hasError(error);
  };

  crearRespuesta(): void {
    //Establecer submit verdaderot
    this.submitted = true;
    if (this.respuestaForm.invalid) {
      return;
    }
    const descripcion = this.respuestaForm.get('descripcion').value;
    const nuevaRespuesta = {
      descripcion,
      preguntaId: this.idPregunta,
      vendedorId: this.idUsuario,
      productoId: this.idProducto // Ajusta según tu lógica
    };

    // Acción API create enviando toda la informacion del formulario
    this.gService
      .create('respuesta', nuevaRespuesta)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: any) => {
          //Obtener respuesta
          this.respRespuesta = data;
          console.log(data);
          this.router.navigate(['/producto/detalle', this.idPregunta]);
        },
        (error: any) => {
          console.error('Error al crear la pregunta:', error);
          // Manejar el error aquí, por ejemplo, mostrar un mensaje de error al usuario
        }
      );
  }

  onReset() {
    this.submitted = false;
    this.respuestaForm.reset();
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
