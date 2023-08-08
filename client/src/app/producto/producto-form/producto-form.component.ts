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
      fotos: [null]
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

  public errorHandling = (control: string, error: string) => {
    return this.productoForm.controls[control].hasError(error);
  };

  //Crear producto
  crearProducto(): void {
    this.submitted = true;

    if (this.productoForm.invalid) {
      return;
    }

    const formData = new FormData();

    // Agregar datos del formulario al formData
    formData.append('nombre', this.productoForm.value.nombre);
    formData.append('descripcion', this.productoForm.value.descripcion);
    formData.append('precio', this.productoForm.value.precio);
    formData.append('cantidad', this.productoForm.value.cantidad);
    formData.append('estado', this.productoForm.value.estado);
    formData.append('categorias', JSON.stringify(this.productoForm.value.categorias));

    // Agregar imágenes al formData
    for (let i = 0; i < this.productoForm.value.fotos.length; i++) {
      formData.append('fotos', this.productoForm.value.fotos[i]);
    }

    // Llamar al servicio para crear el producto
    this.gService.createFormData('producto', formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.respProducto = data;
        this.router.navigate(['/producto-vendedor'], {
          queryParams: { create: 'true' }
        });
      });
  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      this.productoForm.patchValue({ fotos: file }); // Almacena el archivo en el FormGroup
    }
  }

  // crearProducto(): void {
  //   //Establecer submit verdadero
  //   this.submitted = true;
  //   //Verificar validación
  //   if (this.productoForm.invalid) {
  //     return;
  //   }
  //   //Obtener id Categorias del Formulario y Crear arreglo con {id: value}
  //   let gFormat: any = this.productoForm.get('categorias').value.map(x => ({ ['id']: x }))
  //   //Asignar valor al formulario
  //   this.productoForm.patchValue({ categoria: gFormat });
  //   console.log(this.productoForm.value);
  //   //Accion API create enviando toda la informacion del formulario
  //   this.gService.create('producto', this.productoForm.value)
  //     .pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
  //       //Obtener respuesta
  //       this.respProducto = data;
  //       this.router.navigate(['/producto-vendedor'], {
  //         queryParams: { create: 'true' }
  //       });
  //     });
  // }

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
