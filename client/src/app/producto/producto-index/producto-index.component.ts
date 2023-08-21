import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { GenericService } from 'src/app/share/generic.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CartService } from 'src/app/share/cart.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';

@Component({
  selector: 'app-producto-index',
  templateUrl: './producto-index.component.html',
  styleUrls: ['./producto-index.component.css'],
})
export class ProductoIndexComponent implements OnInit {
  datos: any[] = [];
  categoriasList: any;
  filtroForm: FormGroup;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private gService: GenericService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private fb: FormBuilder,
    private cartService: CartService,
    private notificacion: NotificacionService) {
    this.listaProductos();
    this.listaCategorias();
  }

  ngOnInit() {
    this.filtroForm = this.fb.group({
      filtroCategoria: [''],
      filtroNombre: [''],
      filtroPrecio: [''],
    });
    this.listaProductos();
    this.listaCategorias();
  }

  // Listar los productos llamando al API
  listaProductos() {
    this.gService
      .list('producto/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any[]) => {
        console.log(data);
        this.datos = data.map((producto) => ({
          ...producto,
          categoriasString: producto.categorias
            .map((categoria) => categoria.descripcion)
            .join(', '),
        }));
      });
  }

  // Listar las categorías
  listaCategorias() {
    this.categoriasList = null;
    this.gService
      .list('categoria')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.categoriasList = data;
      });
  }

  // Obtener las fotos del producto
  obtenerImagen(url) {
    const base64Image = 'data:image/jpeg;base64,' + url;
    return this.sanitizer.bypassSecurityTrustUrl(base64Image);
  }

  ordenarProductos(productos: any[]): any[] {
    const filtroPrecio = this.filtroForm.get('filtroPrecio').value;
    if (filtroPrecio === 'menor') {
      return productos.slice().sort((a, b) => a.precio - b.precio);
    } else if (filtroPrecio === 'mayor') {
      return productos.slice().sort((a, b) => b.precio - a.precio);
    } else {
      return productos;
    }
  }

  aplicarFiltros() {
    const filtroCategoria = this.filtroForm.get('filtroCategoria').value;
    const filtroNombre = this.filtroForm.get('filtroNombre').value.toLowerCase();

    return this.datos.filter(item =>
      (filtroNombre === '' || item.nombre.toLowerCase().includes(filtroNombre)) &&
      (filtroCategoria.length === 0 || item.categorias.some(cat => filtroCategoria.includes(cat.id)))
    );
  }

  // Direccionar a la página de detalle
  detalleProducto(id: number) {
    this.router.navigate(['/producto/detalle', id]);
  }

  // Agregar al carrito
  agregarCarrito(id: number) {
    this.gService
      .get('producto', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.cartService.addToCart(data);
        this.notificacion.mensaje(
          'Orden',
          'Producto: ' + data.producto + ' agregado al carrito',
          TipoMessage.success
        )
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
