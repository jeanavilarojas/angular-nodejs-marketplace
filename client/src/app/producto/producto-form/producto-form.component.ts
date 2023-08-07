import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { GenericService } from 'src/app/share/generic.service';
@Component({
  selector: 'app-producto-form',
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.css'],
})
export class ProductoFormComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();
  titleForm: string = 'Crear';
  categoriasList: any;
  productoInfo: any;
  respProducto: any;
  submitted = false;
  productoForm: FormGroup;
  idProducto: number = 0;
  isCreate: boolean = true;

  constructor(
    private fb: FormBuilder,
    private gService: GenericService,
    private router: Router,
    private activeRouter: ActivatedRoute
  ) {
    this.formularioReactive();
    this.listacategorias();

  }
  ngOnInit(): void {
    //Verificar si se envio un id por parametro para crear formulario para actualizar
    this.activeRouter.params.subscribe((params: Params) => {
      this.idProducto = params['id'];
      if (this.idProducto != undefined) {
        this.isCreate = false;
        this.titleForm = "Actualizar";
        //Obtener producto a actualizar del API
        this.gService.get('producto', this.idProducto).pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            this.productoInfo = data;
            //Establecer los valores en cada una de las entradas del formulario
            this.productoForm.setValue({
              id: this.productoInfo.id,
              nombre: this.productoInfo.nombre,
              descripcion: this.productoInfo.descripcion,
              precio: this.productoInfo.precio,
              estado: this.productoInfo.estado,
              cantidad: this.productoInfo.cantidad,
              categorias: this.productoInfo.categorias.map(({ id }) => id)
            })
          });
      }
    });
  }

  // Crear formulario
  formularioReactive() {
    //[null, Validators.required]
    this.productoForm = this.fb.group({
      id: [null, null],
      nombre: [null, Validators.compose([
        Validators.required,
        Validators.minLength(5)
      ])],
      descripcion: [null, Validators.compose([
        Validators.required,
        Validators.minLength(5)
      ])],
      precio: [null, Validators.compose([
        Validators.required,
        Validators.pattern(/^\d+(\.\d{1,2})?$/)
      ])],
      cantidad: [null, Validators.compose([
        Validators.required,
        Validators.pattern(/^[1-9]\d*$/)
      ])],
      estado: [null, Validators.required],
      categorias: [null, Validators.required],
    })
  }
  
  listacategorias() {
    this.categoriasList = null;
    this.gService
      .list('categoria')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        // console.log(data);
        this.categoriasList = data;
      });
  }

  // Método para manejar el cambio de archivo
  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      this.productoForm.get('imagen').setValue(file);
    }
  }

  public errorHandling = (control: string, error: string) => {
    return this.productoForm.controls[control].hasError(error);
  };
  //Crear producto
  crearProducto(): void {
    //Establecer submit verdadero
    this.submitted = true;
    //Verificar validación
    if (this.productoForm.invalid) {
      return;
    }
    //Obtener id Categorias del Formulario y Crear arreglo con {id: value}
    let gFormat: any = this.productoForm.get('categorias').value.map(x => ({ ['id']: x }))
    //Asignar valor al formulario
    this.productoForm.patchValue({ categoria: gFormat });
    console.log(this.productoForm.value);
    //Accion API create enviando toda la informacion del formulario
    this.gService.create('producto', this.productoForm.value)
      .pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
        //Obtener respuesta
        this.respProducto = data;
        this.router.navigate(['/producto-vendedor'], {
          queryParams: { create: 'true' }
        });
      });
  }

  //Actualizar Producto
  actualizarProducto() {
    //Establecer submit verdadero
    this.submitted = true;
    //Verificar validación
    if (this.productoForm.invalid) {
      return;
    }
    //Obtener id Categorias del Formulario y Crear arreglo con {id: value}
    let gFormat: any = this.productoForm.get('categorias').value.map(x => ({ ['id']: x }));
    //Asignar valor al formulario 
    this.productoForm.patchValue({ categoria: gFormat });
    console.log(this.productoForm.value);
    //Accion API create enviando toda la informacion del formulario
    this.gService.update('producto', this.productoForm.value)
      .pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
        //Obtener respuesta
        this.respProducto = data;
        this.router.navigate(['/producto-vendedor'], {
          queryParams: { update: 'true' }
        });
      });
  }

  onReset() {
    this.submitted = false;
    this.productoForm.reset();
  }

  onBack() {
    this.router.navigate(['/producto-vendedor']);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Desinscribirse
    this.destroy$.unsubscribe();
  }
}