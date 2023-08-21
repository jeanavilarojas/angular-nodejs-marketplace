import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { GenericService } from 'src/app/share/generic.service';

@Component({
  selector: 'app-producto-pregunta',
  templateUrl: './producto-pregunta.component.html',
  styleUrls: ['./producto-pregunta.component.css']
})
export class ProductoPreguntaComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();
  //Titulo
  titleForm: string = 'Crear';
  //Lista de categorias
  productoID: Number;
  //Producto a actualizar
  preguntaInfo: any;
  currentUser: any;
  //Respuesta del API crear/modificar
  respPregunta: any;
  //Sí es submit
  idUsuario: number;
  submitted = false;
  //Nombre del formulario
  preguntaForm: FormGroup;
  //id del Producto
  idPregunta: number = 0;
  //Sí es crear
  isCreate: boolean = true;

  constructor(
    private fb: FormBuilder,
    private gService: GenericService,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private authService: AuthenticationService
  ) {
    this.formularioReactive();
    this.productoID = +this.activeRouter.snapshot.paramMap.get('id');
    // this.listaProductos();
    this.idUsuario = this.authService.usuarioId;
    console.log(this.idUsuario);
    console.log(this.productoID);
  }
  ngOnInit(): void {
    //Verificar si se envio un id por parametro para crear formulario para actualizar
    this.activeRouter.params.subscribe((params: Params) => {
      this.idPregunta = params['id'];
      if (this.idPregunta != undefined) {
        this.isCreate = false;
        this.titleForm = 'Crear';
        //Obtener videojuego a actualizar del API
        this.gService
          .get('pregunta', this.idPregunta)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            this.preguntaInfo = data;
          });
      } else {
        // Maneja el caso cuando el objeto es nulo
        this.formularioReactive();
      }
    });
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
    this.idUsuario = this.currentUser.usuario.id;
  }
  formularioReactive() {
    //[null, Validators.required]
    this.preguntaForm = this.fb.group({
      id: [null, null],
      Pregunta: [
        null,
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],
      productoId: [null, Validators.required],
      clienteId: [null, Validators.required],

    });
  }

  updatePregunta(): void { }

  crearPregunta(): void {
    //Establecer submit verdaderot
    this.submitted = true;
    console.log(this.productoID);
    this.preguntaForm.patchValue({ clienteId: this.idUsuario });

    this.preguntaForm.patchValue({ productoId: this.productoID });
    console.log(this.preguntaForm);

    //Verificar validación
    if (this.preguntaForm.invalid) {
      return;
    }

    const formValue = this.preguntaForm.value;
    formValue.clienteId = this.idUsuario;
    formValue.productoId = this.productoID;

    console.log(formValue);

    // Acción API create enviando toda la informacion del formulario
    this.gService
      .create('pregunta', formValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: any) => {
          //Obtener respuesta
          this.respPregunta = data;
          console.log(data);
          this.router.navigate(['/producto/detalle', this.productoID]);
        },
        (error: any) => {
          console.error('Error al crear la pregunta:', error);
          // Manejar el error aquí, por ejemplo, mostrar un mensaje de error al usuario
        }
      );
  }

  public errorHandling = (control: string, error: string) => {
    return this.preguntaForm.controls[control].hasError(error);
  };
  //Actualizar producto
  onReset() {
    this.submitted = false;
    this.preguntaForm.reset();
  }
  onBack() {
    this.router.navigate(['/producto/usuario', this.idUsuario]);
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    // Desinscribirse
    this.destroy$.unsubscribe();
  }
}
