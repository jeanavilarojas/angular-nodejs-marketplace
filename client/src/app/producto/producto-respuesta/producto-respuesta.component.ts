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
  titleForm: string = 'Crear';
  respuestaForm: FormGroup;
  idPregunta: number;

  constructor(
    private fb: FormBuilder,
    private gService: GenericService,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private authService: AuthenticationService
  ) {
    this.formularioReactive();
    this.idPregunta = +this.activeRouter.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.activeRouter.params.subscribe((params: Params) => {
      const idRespuesta = params['id'];
      if (idRespuesta !== undefined) {
      }
    });
  }

  formularioReactive() {
    this.respuestaForm = this.fb.group({
      descripcion: [null, Validators.compose([Validators.required, Validators.minLength(3)])],
    });
  }

  public errorHandling = (control: string, error: string) => {
    return this.respuestaForm.controls[control].hasError(error);
  };

  crearRespuesta(): void {
    if (this.respuestaForm.invalid) {
      return;
    }
    const descripcion = this.respuestaForm.get('descripcion').value;
    const nuevaRespuesta = {
      descripcion,
      preguntaId: this.idPregunta,
      vendedorId: this.authService.usuarioId,
    };
    this.gService
      .create('respuesta', nuevaRespuesta)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: any) => {
          console.log('Respuesta creada con éxito:', data);
          this.router.navigate(['/producto/detalle/']);
        },
        (error: any) => {
          console.error('Error al crear la respuesta:', error);
        }
      );
  }

  onReset() {
    this.respuestaForm.reset();
  }

  onBack() {
    this.router.navigate(['/producto/detalle']);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
