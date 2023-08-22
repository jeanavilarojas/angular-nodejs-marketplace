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
  titleForm: string = 'Crear';
  productoID: Number;
  preguntaInfo: any;
  currentUser: any;
  respPregunta: any;
  idUsuario: number;
  submitted = false;
  preguntaForm: FormGroup;
  idPregunta: number = 0;
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
    this.idUsuario = this.authService.usuarioId;
    console.log(this.idUsuario);
    console.log(this.productoID);
  }
  ngOnInit(): void {
    this.activeRouter.params.subscribe((params: Params) => {
      this.idPregunta = params['id'];
      if (this.idPregunta != undefined) {
        this.isCreate = false;
        this.gService
          .get('pregunta', this.idPregunta)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            this.preguntaInfo = data;
          });
      } else {
        this.formularioReactive();
      }
    });
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
    this.idUsuario = this.currentUser.usuario.id;
  }
  
  formularioReactive() {
    this.preguntaForm = this.fb.group({
      id: [null, null],
      descripcion: [null, Validators.compose([Validators.required, Validators.minLength(3)]),],
      productoId: [null, Validators.required],
      clienteId: [null, Validators.required],
    });
  }

  actualizarPregunta(): void { }

  crearPregunta(): void {
    this.submitted = true;
    console.log(this.productoID);
    this.preguntaForm.patchValue({ clienteId: this.idUsuario });
    this.preguntaForm.patchValue({ productoId: this.productoID });
    console.log(this.preguntaForm);
    if (this.preguntaForm.invalid) {
      return;
    }
    const formValue = this.preguntaForm.value;
    formValue.clienteId = this.idUsuario;
    formValue.productoId = this.productoID;
    console.log(formValue);
    this.gService
      .create('pregunta', formValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: any) => {
          this.respPregunta = data;
          console.log(data);
          this.router.navigate(['/producto/detalle', this.productoID]);
        },
        (error: any) => {
          console.error('Error al crear la pregunta:', error);
        }
      );
  }

  public errorHandling = (control: string, error: string) => {
    return this.preguntaForm.controls[control].hasError(error);
  };

  onReset() {
    this.submitted = false;
    this.preguntaForm.reset();
  }

  onBack() {
    this.router.navigate(['/producto/detalle', this.productoID]);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
