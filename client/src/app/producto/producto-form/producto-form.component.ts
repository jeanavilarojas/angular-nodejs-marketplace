import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/share/authentication.service';
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
  currentUser: any;
  idUsuario: number;
  idProducto: number = 0;
  isCreate: boolean = true;

  constructor(
    private fb: FormBuilder,
    private gService: GenericService,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private authService: AuthenticationService
  ) {
    this.formularioReactive();
    this.listaCategorias();
    this.idUsuario = this.authService.usuarioId;
    console.log(this.idUsuario);
  }

  ngOnInit(): void {
    //Verificar si se envio un id por parametro para crear formulario para actualizar
    this.activeRouter.params.subscribe((params: Params) => {
      this.idProducto = params['id'];
      if (this.idProducto != undefined) {
        this.isCreate = false;
        this.titleForm = "Actualizar";
        // Obtener producto a actualizar del API
        this.gService.get('producto', this.idProducto).pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            this.productoInfo = data;
            console.log(data);
            //Establecer los valores en cada una de las entradas del formulario
            this.productoForm.setValue({
              id: this.productoInfo.id,
              nombre: this.productoInfo.nombre,
              descripcion: this.productoInfo.descripcion,
              precio: this.productoInfo.precio,
              cantidad: this.productoInfo.cantidad,
              estado: this.productoInfo.estado,
              vendedorId: this.productoInfo.vendedorId,
              categorias: this.productoInfo.categorias.map(({ id }) => id),
              myFile: "",
            });
          });
      }
    });
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
    this.idUsuario = this.currentUser.usuario.id;
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
      vendedorId: [null, Validators.required],
      categorias: [null, Validators.required],
      myFile: [null, Validators.required],
    });
  }

  // Listar las categorías
  listaCategorias() {
    this.categoriasList = null;
    this.gService
      .list('categoria')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        // console.log(data);
        this.categoriasList = data;
      });
  }

  // Manejo de errores
  public errorHandling = (control: string, error: string) => {
    return this.productoForm.controls[control].hasError(error);
  };

  //Crear producto
  crearProducto(): void {
    // Establecer submit verdadero
    this.submitted = true;
    this.productoForm.patchValue({ vendedorId: this.idUsuario });

    // Verificar validación
    if (this.productoForm.invalid) {
      return;
    }

    const formData = new FormData();
    const formValue = this.productoForm.value;

    // Agregar los datos al FormData
    Object.keys(formValue).forEach((key) => {
      const value = formValue[key];

      if (key === 'myFile') {
        // If the key is 'myFile', it contains an array of files, so we need to handle it differently
        const files: File[] = value as File[];
        for (const file of files) {
          formData.append('myFile', file, file.name);
        }
      } else if (key === 'categorias') {
        formData.append(key, JSON.stringify(value));
      } else {
        // Agregar otros valores al FormData
        formData.append(key, value);
      }
    });

    //Asignar valor al formulario
    console.log(this.productoForm.value);
    // Acción API create enviando toda la información del formulario
    this.gService.create('producto', formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.respProducto = data;
        this.router.navigate(['/producto-vendedor', this.idUsuario]);
        console.log(data)
      });
  }

  //Actualizar Producto
  actualizarProducto(): void {
    //Establecer submit verdadero
    this.submitted = true;
    //Validar el usuario vendedor
    this.productoForm.patchValue({ vendedorId: this.idUsuario });
    console.log(this.productoForm);
    //Verificar validación
    if (this.productoForm.invalid) {
      return;
    }

    const formData = new FormData();
    const formValue = this.productoForm.value;

    // Agregar los datos al FormData
    Object.keys(formValue).forEach((key) => {
      const value = formValue[key];

      if (key === 'myFile') {
        // If the key is 'myFile', it contains an array of files, so we need to handle it differently
        const files: File[] = value as File[];
        for (const file of files) {
          formData.append('myFile', file, file.name);
        }
      } else if (key === 'publicar') {
        formData.append(key, JSON.stringify(value));
      } else {
        // Agregar otros valores al FormData
        formData.append(key, value);
      }
    });

    //Obtener id Categorias del Formulario y Crear arreglo con {id: value}
    // let gFormat: any = this.productoForm.get('categorias').value.map(x => ({ ['id']: x }));

    //Asignar valor al formulario 
    // this.productoForm.patchValue({ categoria: gFormat });
    console.log(this.productoForm.value);
    //Accion API create enviando toda la informacion del formulario
    this.gService.update('producto', this.productoForm.value)
      .pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
        //Obtener respuesta
        this.respProducto = data;
        this.router.navigate(['/producto-vendedor', this.idUsuario]);
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

  onFileChange(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      const imageArray: File[] = [];
      for (const file of files) {
        imageArray.push(file);
      }
      const maxImages = 5; // Limitar la cantidad de imágenes a 5
      const imagesToUpload = imageArray.slice(0, maxImages);
      this.productoForm.patchValue({ myFile: imagesToUpload });
    }
  }

  countSelectedImages(): number {
    const myFileControl = this.productoForm.get('myFile');
    return myFileControl.value ? myFileControl.value.length : 0;
  }
}
